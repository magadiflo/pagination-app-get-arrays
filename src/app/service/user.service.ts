import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly serverUrl: string = 'http://localhost:8085';

  constructor(private http: HttpClient) { }

  //* Make call to the back end  API to retrieve page of users
  getUsers(name: string = '', page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/v0/api/users?name=${name}&page=${page}&size=${size}`);
  }

}