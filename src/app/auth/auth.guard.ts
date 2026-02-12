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

  const user = store.selectSignal(selectUser)();
  const status = store.selectSignal(selectUserStatus)();

  const access = authService.getToken();
  const refresh = authService.getRefreshToken();

  store.dispatch(getProfile());


  return store.select(selectUserStatus).pipe(
    filter(s => s !== 'pending' && s !== 'loading'),
    take(1),
    map(s => {
      const currentUser = store.selectSignal(selectUser)();
      return currentUser ? true : router.createUrlTree(['/start']);
    })
  );
};