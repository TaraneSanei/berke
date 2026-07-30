import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../state/user/user.actions';
import { environment } from '../../environments/environment';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

// Helper to attach the access token to a request
function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Bypass auth for Liara presigned storage URLs
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store);

  const token = authService.getToken();
  const authReq = token ? addAuthHeader(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefreshCall = req.url.includes('token/refresh');
      if (error.status !== 401 || isRefreshCall) {
        return throwError(() => error);
      }
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((t): t is string => t !== null),
          take(1),
          switchMap(newToken => next(addAuthHeader(req, newToken)))
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null); 

      return authService.refreshAccessToken().pipe(
        switchMap(response => {
          isRefreshing = false;
          refreshTokenSubject.next(response.access);
          return next(addAuthHeader(req, response.access));
        }),
        catchError(refreshError => {
          isRefreshing = false;
          refreshTokenSubject.error(refreshError);
          refreshTokenSubject = new BehaviorSubject<string | null>(null);
          store.dispatch(logout());
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
