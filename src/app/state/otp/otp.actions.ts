import { createAction, props } from "@ngrx/store";

export const requestOtp = createAction(
    '[User] Request OTP'
)

export const requestOtpSuccess = createAction(
    '[User] Request OTP Success'
);

export const requestOtpFailure = createAction(
    '[User] Request OTP Failure',
    props<{ error: any }>()
);

export const verifyOtp = createAction(
    '[User] Verify OTP',
    props<{ otp: number }>()
)

export const verifyOtpSuccess = createAction(
    '[User] Verify OTP Success'
);

export const verifyOtpFailure = createAction(
    '[User] Verify OTP Failure',
    props<{ error: any }>()
);

export const startOtpTimer = createAction('[OTP] Start Timer');

export const tickOtpTimer = createAction('[OTP] Tick Timer');

export const stopOtpTimer = createAction('[OTP] Stop Timer');
