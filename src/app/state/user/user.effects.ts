import { Injectable, inject } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, catchError, of, map, tap, from } from "rxjs";
import { login, getProfile, loginFailure, loginSuccess, getProfileFailure, getProfileSuccess, setPreferences, setPreferencesFailure, setPreferencesSuccess, logout, updateProfile, updateProfileSuccess, updateProfileFailure, changePassword, changePasswordSuccess, changePasswordFailure } from "./user.actions";
import { BerkeService } from "../../shared/services/berke.service";
import { Router } from "@angular/router";





@Injectable()
export class UserEffects {
  private authService = inject(AuthService);
  private actions$ = inject(Actions);
  private berkeService = inject(BerkeService);
  private router = inject(Router);


  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) =>
        this.authService.login(action.phoneNumber, action.password).pipe(
          map(response => {
            if (response.access && response.refresh) {
              return loginSuccess({ token: response.access, refreshToken: response.refresh });
            } else {
              return loginFailure({ error: response.error });
            }
          }),
          catchError((response) => of(loginFailure({ error: response.error })))
        )
      )))


  loginSuccess$ = createEffect(()=>
  this.actions$.pipe(
    ofType(loginSuccess),
    tap((action) => {
      this.authService.setToken(action.token);
      this.authService.setRefreshToken(action.refreshToken);
    }),
    map(() => getProfile()) 
  ),
)

  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getProfile),
      mergeMap(() =>
        this.authService.getProfile().pipe(
          map(user => {
            if (user.theme) {
              this.berkeService.setTheme(user.theme as 'sunrise' | 'sunset' | 'forest' | 'aurora' | 'mountain' | 'morning');
            }
            return getProfileSuccess({ user })
          }),
          catchError((response) => of(getProfileFailure({ error: response.error })))
        ))));

  setPreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setPreferences),
      mergeMap((action) =>
        this.authService.updatePreferences(action.preferences).pipe(
          mergeMap(response => {
              return [
                setPreferencesSuccess(),
                getProfile()
              ];
          }),
          catchError((response) => of(setPreferencesFailure({ error: response.error })))
        ))));


  updateProfile$ = createEffect(() => 
  this.actions$.pipe(
    ofType(updateProfile),
    mergeMap((action) =>
    this.authService.updateProfile(action.user).pipe(
      mergeMap((response) => {
        return [
          updateProfileSuccess({ user: response }),
          getProfile()
        ];
      }),
      catchError((response) => of(updateProfileFailure({ error: response.error })))
    ))))
  

    changePassword$ = createEffect(() => 
    this.actions$.pipe(
      ofType(changePassword),
      mergeMap((action) =>
      from(this.authService.changePassword(action.oldPassword, action.newPassword)).pipe(
        map(() => changePasswordSuccess()),
        catchError((response) => of(changePasswordFailure({ error: response.error })))
      ))))


  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
