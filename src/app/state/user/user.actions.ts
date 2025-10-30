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

export const signup = createAction(
    '[User] Signup',
    props<{ phoneNumber: string; password: string }>()
);

export const signupSuccess = createAction(
    '[User] Signup Success');

export const signupFailure = createAction(
    '[User] Signup Failure',
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

export const changePassword = createAction(
    '[User] Change Password',
    props<{ oldPassword: string; newPassword: string }>()
)

export const changePasswordSuccess = createAction(
    '[User] Change Password Success'
);

export const changePasswordFailure = createAction(
    '[User] Change Password Failure',
    props<{ error: any }>()
);

export const logout = createAction('[User] Logout');
