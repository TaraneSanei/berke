import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../state/user/user.actions';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const store = inject(Store);

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('token/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshAccessToken().pipe(
            switchMap((response) => {
              isRefreshing = false;
              if (response?.access) {
                refreshTokenSubject.next(response.access);
                const retryReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${response.access}`)
                });
                return next(retryReq);
              } else {
                store.dispatch(logout())
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              store.dispatch(logout())

              return throwError(() => refreshError);
            })
          );
        } else {
          // Wait for ongoing refresh
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((newToken) => {
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(retryReq);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};