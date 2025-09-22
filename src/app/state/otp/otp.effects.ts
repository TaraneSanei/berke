import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AuthService } from "../../auth/auth.service";
import { mergeMap, from, catchError, of, interval, map, switchMap, takeWhile, withLatestFrom } from "rxjs";
import { requestOtp, requestOtpSuccess, startOtpTimer, requestOtpFailure, tickOtpTimer, verifyOtp, verifyOtpFailure, verifyOtpSuccess } from "./otp.actions";
import { selectOtpTimer } from "./otp.selector";
import { getProfile } from "../user/user.actions";


@Injectable()
export class OTPEffects {
  private authService = inject(AuthService);
  private actions$ = inject(Actions);
  private store = inject(Store);

  requestOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestOtp),
      mergeMap(() =>
        from(this.authService.requestOTP()).pipe(
          mergeMap(() => [
            requestOtpSuccess(),
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
      mergeMap((action) =>
        from(this.authService.verifyOTP(action.otp)).pipe(
          mergeMap(() => [
            verifyOtpSuccess(),
            getProfile()
          ]),
          catchError((error) => of(verifyOtpFailure({ error: error })))
        ))))
  }