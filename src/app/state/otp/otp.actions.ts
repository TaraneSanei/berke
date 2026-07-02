import { createAction, props } from "@ngrx/store";

export const requestOtp = createAction(
    '[User] Request OTP',
    props<{ phoneNumber: string }>()
);

export const requestOtpSuccess = createAction(
    '[User] Request OTP Success',
    props<{ userExists: boolean }>() 
);


export const requestOtpFailure = createAction(
    '[User] Request OTP Failure',
    props<{ error: any }>()
);

export const verifyOtp = createAction(
    '[User] Verify OTP',
    props<{phoneNumber:string; otp: string }>()
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

export const requestPasswordOtp = createAction(
    '[User] Request Password OTP'
);

export const requestPasswordOtpSuccess = createAction(
    '[User] Request Password OTP Success'
);

export const requestPasswordOtpFailure = createAction(
    '[User] Request Password OTP Failure',
    props<{ error: any }>()
);
