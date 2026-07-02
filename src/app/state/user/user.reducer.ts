import { createReducer, on } from "@ngrx/store";
import { User } from "../../models/data.models";
import { login, loginSuccess, loginFailure, getProfile, getProfileSuccess, getProfileFailure, updateProfile, updateProfileSuccess, updateProfileFailure, logout, setPreferences, setPreferencesSuccess, setPreferencesFailure, setPasswordWithOtp, setPasswordWithOtpFailure, setPasswordWithOtpSuccess } from "./user.actions";



export interface UserState {
    user: User | null;
    status: 'pending' | 'loading' | 'success' | 'error';
    error: string;
}

export const initialUserState: UserState = {
    user: null,
    status: 'pending',
    error: ''
};

export const UserReducer = createReducer(
    initialUserState,
    on(login, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(loginSuccess, (state) => ({
        ...state,
        status: 'success' as 'success',
        error: ''
    })), 
    on(loginFailure, (state, { error }) => ({
        ...state,
        status: 'error' as 'error',
        error: error
    })),
    on(getProfile, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(getProfileSuccess, (state, { user }) => ({
        ...state,
        user: user,
        status: 'success' as 'success',
        error: ''
    })),
    on(getProfileFailure, (state, { error }) => ({
        ...state,
        status: 'error' as 'error',
        error: error
    })),
    on(updateProfile, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(updateProfileSuccess, (state, { user }) => ({
        ...state,
        user: user,
        status: 'success' as 'success',
        error: ''
    })),
    on(updateProfileFailure, (state, { error }) => ({
        ...state,
        status: 'error' as 'error',
        error: error
    })),
    on(setPreferences, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(setPreferencesSuccess, (state) => ({
        ...state,
        status: 'success' as 'success',
        error: ''
    })),
    on(setPreferencesFailure, (state, { error }) => ({
        ...state,
        status: 'error' as 'error',
        error: error
    })),
   on(setPasswordWithOtp, (state) => ({
        ...state,
        status: 'loading' as const,
        error: ''
    })),
    on(setPasswordWithOtpSuccess, (state) => ({
        ...state,
        status: 'success' as const,
        error: ''
    })),
    on(setPasswordWithOtpFailure, (state, { error }) => ({
        ...state,
        status: 'error' as const,
        error: error
    })),
    on(logout, (state) => ({
        ...state,
        user: null,
        status: 'pending' as 'pending',
        error: ''
    })),
    
)