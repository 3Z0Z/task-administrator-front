import { HttpInterceptorFn } from '@angular/common/http';

import { SessionVariables } from '../helpers/session-variables';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem(SessionVariables.session_token);
  const isProjectOrTask = req.url.includes('/project') || req.url.includes('/task');
  if (token && isProjectOrTask) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
    return next(cloned);
  }
  return next(req);
};