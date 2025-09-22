import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { UserState } from "./user.reducer";

export const SelectUser = (state: AppState) => state.user;
export const selectUser = createSelector(
    SelectUser,
    (state: UserState) => state.user
);
export const selectAuthenticated = createSelector(
    SelectUser,
    (state: UserState) => state.user?.authenticated
);

export const selectPhoneNumber = createSelector(
    SelectUser,
    (state: UserState) => state.user?.phoneNumber
);

export const selectPreferences = createSelector(
    SelectUser,
    (state: UserState) => state.user?.preferences
);

export const selectUserStatus = createSelector(
    SelectUser,
    (state: UserState) => state.status
);

export const selectUserError = createSelector(
    SelectUser,
    (state: UserState) => state.error
);
