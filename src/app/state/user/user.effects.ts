import { Injectable, inject } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { mergeMap, catchError, of, map, tap, from, exhaustMap } from "rxjs";
import { login, getProfile, loginFailure, loginSuccess, getProfileFailure, getProfileSuccess, setPreferences, setPreferencesFailure, setPreferencesSuccess, logout, updateProfile, updateProfileSuccess, updateProfileFailure, setPasswordWithOtp, setPasswordWithOtpFailure, setPasswordWithOtpSuccess, logoutSuccess, logoutFailure } from "./user.actions";
import { BerkeService } from "../../shared/services/berke.service";
import { Router } from "@angular/router";
import { stopOtpTimer } from "../otp/otp.actions";





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
            if (response.access) {
              return loginSuccess({ token: response.access });
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
  

  setPasswordWithOtp$ = createEffect(() => 
    this.actions$.pipe(
      ofType(setPasswordWithOtp),
      mergeMap((action) =>
        from(this.authService.setPasswordWithOTP(action.otp, action.newPassword)).pipe(
          mergeMap(() => [
            setPasswordWithOtpSuccess(),
            stopOtpTimer() // Stops and clears the timer on successful change
          ]),
          catchError((response) => of(setPasswordWithOtpFailure({ error: response.error })))
        ))));


logout$ = createEffect(() =>
  this.actions$.pipe(
    ofType(logout),
    exhaustMap(() =>
      this.authService.logout().pipe(
        map(() => logoutSuccess()),
        catchError((error) => of(logoutFailure({ error })))
      )
    )
  )
);

logoutSuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(logoutSuccess),
      tap(() => {
        this.router.navigate(['/login'])
        this.authService.removeToken()
})
      
    ),
  { dispatch: false }
)

}