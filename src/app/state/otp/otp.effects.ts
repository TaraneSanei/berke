import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AuthService } from "../../auth/auth.service";
import { mergeMap, from, catchError, of, interval, map, switchMap, takeWhile, withLatestFrom } from "rxjs";
import { requestOtp, requestOtpSuccess, startOtpTimer, requestOtpFailure, tickOtpTimer, verifyOtp, verifyOtpFailure, verifyOtpSuccess, requestPasswordOtp, requestPasswordOtpFailure, requestPasswordOtpSuccess } from "./otp.actions";
import { selectOtpTimer } from "./otp.selector";
import { getProfile, loginSuccess } from "../user/user.actions";


@Injectable()
export class OTPEffects {
  private authService = inject(AuthService);
  private actions$ = inject(Actions);
  private store = inject(Store);

  requestOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestOtp),
      mergeMap((action) =>
        from(this.authService.requestOTP(action.phoneNumber)).pipe(
          mergeMap((response) => [
            requestOtpSuccess({userExists: response.user_exists}),
            startOtpTimer(),
          ]),
          catchError((error) => of(requestOtpFailure({ error: error })))
        ))));
        
  otpTimer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startOtpTimer),
      switchMap(() =>
        interval(1000).pipe(
          withLatestFrom(this.store.select(selectOtpTimer)),
          takeWhile(([_, timer]) => timer !== null && timer > 0),
          map(() => tickOtpTimer())
        ))));

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyOtp),
      switchMap((action) =>
        from(this.authService.verifyOTP(action.phoneNumber, action.otp)).pipe(
          mergeMap((response) => [
            loginSuccess({ token: response.access}),
            verifyOtpSuccess(),
          ]),
          catchError((error) => of(verifyOtpFailure({ error: error })))
        ))))


      requestPasswordOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestPasswordOtp),
      mergeMap(() =>
        from(this.authService.requestPasswordOTP()).pipe(
          mergeMap(() => [
            requestPasswordOtpSuccess(),
            startOtpTimer(),
          ]),
          catchError((error) => of(requestPasswordOtpFailure({ error: error })))
        ))));
        
  }