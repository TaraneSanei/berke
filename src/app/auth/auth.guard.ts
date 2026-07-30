import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take, map, of, switchMap } from 'rxjs';
import { selectUser, selectUserStatus } from '../state/user/user.selector';
import { AuthService } from './auth.service';
import { getProfile } from '../state/user/user.actions';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  const access = authService.getToken();

  // if (!access) {
  //   return router.createUrlTree(['/login']);
  // }

  const user = store.selectSignal(selectUser)();
  const status = store.selectSignal(selectUserStatus)();
  
  if (!user && status !== 'loading') {
    store.dispatch(getProfile());
  }

  return store.select(selectUserStatus).pipe(
    filter(s => s !== 'pending' && s !== 'loading'),
    take(1),
    switchMap(() => store.select(selectUser).pipe(
      take(1),
      map(currentUser => currentUser ? true : router.createUrlTree(['/login']))
    ))
  );
};
