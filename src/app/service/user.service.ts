import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APIResponse } from '../interface/api-response.interface';
import { Page } from '../interface/page.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly serverUrl: string = 'http://localhost:8085';

  constructor(private http: HttpClient) { }

  //* Make call to the back end  API to retrieve page of users
  //* 1° Enfoque en cómo llamar al backend
  users$ = (name: string = '', page: number = 0, size: number = 10): Observable<APIResponse<Page>> =>
    this.http.get<APIResponse<Page>>(`${this.serverUrl}/v0/api/users?name=${name}&page=${page}&size=${size}`);

  //* 2° Enfoque en cómo llamar al backend
  getUsers(name: string = '', page: number = 0, size: number = 10): Observable<APIResponse<Page>> {
    return this.http.get<APIResponse<Page>>(`${this.serverUrl}/v0/api/users?name=${name}&page=${page}&size=${size}`);
  }

  /**
   * * NOTA: 
   * * Ambos enfoques hacen lo mismo. Así que se puede usar cualquiera de los dos,
   * * en el tutorial se usa el 1° enfoque, pero con Fernando Herrera usábamos el 2° enfoque
   */

}