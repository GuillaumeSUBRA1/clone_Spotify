import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { AuthPopupStateEnum } from '../model/user.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    tap({
      error: (e: HttpErrorResponse) => {
        if (e.status === 401 && e.url && e.url.includes('auth/get-authenticated-user') && authService.isAuthenticated()) {
          authService.login();
        } else if (e.url && 
          ((req.method !== 'GET' && !e.url.endsWith('song/add')) || 
          (e.url && !e.url.endsWith('auth/get-authenticated-user')) && 
          !authService.isAuthenticated())) {
          authService.openOrCloseAuthPopup(AuthPopupStateEnum.OPEN);
        }
      }
    })
  );
};
