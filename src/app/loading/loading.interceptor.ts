import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { finalize } from 'rxjs';
import { startLoading, stopLoading } from '../state/UI/ui.actions';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
const store = inject(Store);

  if (activeRequests === 0) {
    store.dispatch(startLoading());
  }
  activeRequests++;

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        store.dispatch(stopLoading());
      }
    })
  );};
