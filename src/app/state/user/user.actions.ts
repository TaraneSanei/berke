import { createAction, props } from "@ngrx/store";
import { User } from "../../models/data.models";


export const login = createAction(
    '[User] Login',
    props<{ phoneNumber: string; password: string }>()
);

export const loginSuccess = createAction(
    '[User] Login Success',
    props<{ token: string; refreshToken: string }>()
);

export const loginFailure = createAction(
    '[User] Login Failure',
    props<{ error: any }>()
);


export const getProfile = createAction(
    '[User] Get User');


export const getProfileSuccess = createAction(
    '[User] Get User Success',
    props<{ user: User }>()
);

export const getProfileFailure = createAction(
    '[User] Get User Failure',
    props<{ error: any }>()
);

export const updateProfile = createAction(
    '[User] Update User',
    props<{ user: User }>()
);


export const updateProfileSuccess = createAction(
    '[User] Update User Success',
    props<{ user: User }>()
);

export const updateProfileFailure = createAction(
    '[User] Update User Failure',
    props<{ error: any }>()
);
export const setPreferences = createAction(
    '[User] Set Preferences',
    props<{ preferences: any }>()
);

export const setPreferencesSuccess = createAction(
    '[User] Set Preferences Success');

export const setPreferencesFailure = createAction(
    '[User] Set Preferences Failure',
    props<{ error: any }>()
);
export const setPasswordWithOtp = createAction(
    '[User] Set Password With OTP',
    props<{ otp: string; newPassword: string }>()
);

export const setPasswordWithOtpSuccess = createAction(
    '[User] Set Password With OTP Success'
);

export const setPasswordWithOtpFailure = createAction(
    '[User] Set Password With OTP Failure',
    props<{ error: any }>()
);

export const logout = createAction('[User] Logout');
