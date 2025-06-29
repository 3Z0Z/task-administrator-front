import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../home/services/auth.service';
import { SessionVariables } from '../helpers/session-variables';

export const isAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const session = sessionStorage.getItem(SessionVariables.session_token);
  const expiration = sessionStorage.getItem(SessionVariables.session_expiration);
  const now = new Date().getTime();
  if (session && expiration && + expiration > now) {
    return true;
  }
  const sessionService = inject(AuthService);
  return sessionService.refreshToken().pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
