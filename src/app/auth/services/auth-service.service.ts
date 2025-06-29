import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RegisterAccount } from '../interfaces/register.interface';
import { environment } from '../../../environments/environments';
import { SuccessResponse } from '../../shared/interfaces/success-response.interface';
import { Token } from '../../shared/interfaces/token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  
  private readonly _baseUrl = `${environment.back_end_url}/auth`;

  public registerUser(request: RegisterAccount): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this._baseUrl}/register`, request);
  }

  public getLogin(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this._baseUrl}/login`, { username, password }, { withCredentials: true });
  }

}
