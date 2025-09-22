import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";

export const SelectOTP = (state: AppState) => state.otp;
export const selectOtpTimer = createSelector(
    SelectOTP,
    (state) => state.otpTimer
);

export const selectOtpError = createSelector(
    SelectOTP,
    (state) => state.error
);

export const selectOtpStatus = createSelector(
    SelectOTP,
    (state) => state.status
);
