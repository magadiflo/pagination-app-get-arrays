import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, startWith, catchError, of, BehaviorSubject } from 'rxjs';

import { ApiResponse } from './interface/api-response.interface';
import { Page } from './interface/page.interface';
import { Status } from './interface/user.interface';

import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  userState$!: Observable<{ appState: string, appData?: ApiResponse<Page>, error?: HttpErrorResponse }>;
  responseSubject!: BehaviorSubject<ApiResponse<Page>>;

  constructor(private userService: UserService) { }

  /**
   * * startWith(), emite los elementos que se especifiquen como argumentos antes 
   * * de empezar a emitir las emisiones del Observable fuente. 
   * * 
   * * Por ejemplo:
   * *
   * * const fruit$ = from(["Fresa", "Cereza"]);
   * * fruit$.pipe(startWith("Arándano")).subscribe(console.log);
   * * // Salida: Arándano, Fresa, Cereza
   */

  /** 
   * * Un Subject es un tipo especial de observable que se comporta al mismo
   * * tiempo como OBSERVABLE y como OBSERVER, es decir no tenemos que crear
   * * el observable por un lado y el observer por el otro y luego subscribirnos, sino
   * * que directamente la subject en sí tiene todo lo que necesitamos.
   * *
   * * BehaviorSubject, es un tipo especial de Subject, se inicializa con un valor (si después se actualiza, ese valor 
   * * debe ser del mismo tipo de valor inicial).
   * * Siempre devuelve el último valor, es decir el valor actual de la subscripción,
   * * no guarda los datos
   */

  ngOnInit(): void {
    this.userState$ = this.userService.users$()
      .pipe(
        map((response: ApiResponse<Page>) => {
          //* Estos datos almacenados temporalmente lo mostraremos la primera vez que se llame al método goToPage, en el startWith
          this.responseSubject = new BehaviorSubject<ApiResponse<Page>>(response);
          console.log(response);
          return { appState: 'APP_LOADED', appData: response };
        }),
        startWith({ appState: 'APP_LOADING' }),
        catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error }))
      );
  }

  //* A este punto la aplicación ya ha sido cargada, por eso es que iniciamos en el startWith  con APP_LOADED
  //* Si lo dejamos con APP_LOADING se mostrará el spinner y desaparecerán los registros, no queremos que eso suceda
  goToPage(name?: string, pageNumber?: number): void {
    this.userState$ = this.userService.users$(name, pageNumber)
      .pipe(
        map((response: ApiResponse<Page>) => {
          //* Cuando queremos ir a una siguiente página, mientras va a buscar dichos datos, que muestra la página actual en el startWith. 
          //* Es decir si estamos por ejemplo en la pág. 3 y queremos ir a la 4, en el startWith mostrará los datos de la página 3. 
          //* Si no colocamos esta línea de .next(), lo que hará será mostrar la página 0, que es lo que guardamos 
          //* en el ngOnInit al instanciar el BehaviorSubject pasándole como valor inicial el response
          this.responseSubject.next(response); 
          console.log(response);
          return { appState: 'APP_LOADED', appData: response };
        }),
        startWith({ appState: 'APP_LOADED', appData: this.responseSubject.value }),
        catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error }))
      );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case Status.active:
        return 'text-bg-success';
      case Status.pending:
        return 'text-bg-warning';
      case Status.banned:
        return 'text-bg-danger';
      default:
        return '';
    }
  }

}
