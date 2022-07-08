import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, startWith, catchError, of } from 'rxjs';

import { ApiResponse } from './interface/api-response.interface';
import { Page } from './interface/page.interface';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  userState$!: Observable<{ appState: string, appData?: ApiResponse<Page>, error?: HttpErrorResponse }>;

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

  ngOnInit(): void {
    this.userState$ = this.userService.users$()
      .pipe(
        map((response: ApiResponse<Page>) => {
          console.log(response);
          return { appState: 'APP_LOADED', appData: response };
        }),
        startWith({ appState: 'APP_LOADING' }),
        catchError((error: HttpErrorResponse) => of({ appState: 'APP_ERROR', error }))
      );
  }

}
