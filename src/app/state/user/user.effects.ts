import { Injectable, inject } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, catchError, of, map } from "rxjs";
import { signup, signupSuccess, login, signupFailure, getProfile, loginFailure, loginSuccess, getProfileFailure, getProfileSuccess, setPreferences, setPreferencesFailure, setPreferencesSuccess } from "./user.actions";
import { BerkeService } from "../../shared/services/berke.service";





@Injectable()
export class UserEffects {
  private authService = inject(AuthService);
  private actions$ = inject(Actions);
  private berkeService = inject(BerkeService);


  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      mergeMap((action) =>
        this.authService.signup(action.phoneNumber, action.password).pipe(
          mergeMap(response => {
            return [
              signupSuccess(),
              login({ phoneNumber: action.phoneNumber, password: action.password })
            ];
          }),
          catchError((response) => of(signupFailure({ error: response.error })))
        ))));


  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap((action) =>
        this.authService.login(action.phoneNumber, action.password).pipe(
          mergeMap(response => {
            if (response.access && response.refresh) {
              this.authService.setToken(response.access);
              this.authService.setRefreshToken(response.refresh);
              return [
                loginSuccess({ token: response.access, refreshToken: response.refresh }),
                getProfile()
              ];
            } else {
              return of(loginFailure({ error: response.error }));
            }
          }),
          catchError((response) => of(loginFailure({ error: response.error })))
        ))));

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
          catchError(response => of(getProfileFailure({ error: response.error })))
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
}