import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { SessionsState } from "./sessions.reducer";



export const Selectsessions = (state: AppState) => state.sessions;
export const selectMeditationSessions = createSelector(
    Selectsessions,
    (state: SessionsState) => state.meditationSessions
);
export const selectNext = createSelector(
    Selectsessions,
    (state: SessionsState) => state.next
);
export const selectPrevious = createSelector(
    Selectsessions,
    (state: SessionsState) => state.previous
);
export const selectError = createSelector(
    Selectsessions,
    (state: SessionsState) => state.error
);