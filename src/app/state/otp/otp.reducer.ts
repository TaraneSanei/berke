import { createReducer, on } from "@ngrx/store";
import { requestOtp, requestOtpFailure, requestOtpSuccess, requestPasswordOtp, requestPasswordOtpFailure, requestPasswordOtpSuccess, startOtpTimer, stopOtpTimer, tickOtpTimer, verifyOtp, verifyOtpFailure, verifyOtpSuccess } from "./otp.actions";



export interface OTPState {
    otpTimer: number | null;
    status: 'pending' | 'sent' | 'verified' | 'notVerified' | 'notSent';
    error: string;
    userExists: boolean | null;

}


export const initialOTPState: OTPState = {
    otpTimer: null,
    status: 'pending',
    error: '',
    userExists: null
};


export const OtpReducer = createReducer(
    initialOTPState,
    on(requestOtp, (state) => ({
        ...state,
    })),
    on(requestOtpSuccess, (state, { userExists }) => ({
        ...state,
        error: '',
        status: 'sent' as 'sent',
        otpTimer:120,
        userExists: userExists
    })),

    on(requestOtpFailure, (state, {error}) => ({
        ...state,
        status: 'notSent' as 'notSent',
        error: error,
        userExists: null

    })),
    on(verifyOtp, (state) => ({
        ...state,
    })),
    on(verifyOtpSuccess, (state) => ({
        ...state,
        error: '',
        status: 'verified' as 'verified',
    })),
    on(verifyOtpFailure, (state, { error }) => ({
        ...state,
        error: error,
        status: 'notVerified' as 'notVerified'
    })),
    on(startOtpTimer, (state) => ({
        ...state,
        otpTimer: 120
    })),
    on(tickOtpTimer, (state) => ({
        ...state,
        otpTimer: state.otpTimer && state.otpTimer > 0 ? state.otpTimer -1 : 0
    })),
    on(stopOtpTimer, (state) => ({
        ...state,
        otpTimer: null
    })),
        on(requestPasswordOtp, (state) => ({
        ...state,
    })),
    on(requestPasswordOtpSuccess, (state) => ({
        ...state,
        error: '',
        status: 'sent' as const,
        otpTimer: 120,
    })),
    on(requestPasswordOtpFailure, (state, { error }) => ({
        ...state,
        status: 'notSent' as const,
        error: error,
    }))
)