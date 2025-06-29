import { Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { Token } from '../../shared/interfaces/token.interface';
import { SessionVariables } from '../../helpers/session-variables';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly _router = inject(Router);

  private readonly baseUrl = `${environment.back_end_url}/auth`;

  public refreshToken(): Observable<Token> {
    return this.http.post<Token>(`${this.baseUrl}/refresh-token`, null, { withCredentials: true })
      .pipe(
        tap((res: Token) => {
          if (res?.access_token) {
            sessionStorage.setItem(SessionVariables.session_token, res.access_token);
            sessionStorage.setItem(SessionVariables.session_expiration, (new Date().getTime() + 15 * 60 * 1000).toString());
          }
        })
      );
  }

  public logout(): Observable<any> {
    const headers = new HttpHeaders()
      .append('Authorization', `Bearer ${sessionStorage.getItem(SessionVariables.session_token)}`);
    return this.http.post(`${this.baseUrl}/logout`, null, { headers, withCredentials: true })
      .pipe(
        tap(() => {
          localStorage.clear();
          sessionStorage.clear();
          this._router.navigate(['/auth']);
        })
      );
  }

}
