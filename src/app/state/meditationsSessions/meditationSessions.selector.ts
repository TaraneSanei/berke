import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { MeditationSessionsState } from "./meditationSessions.reducer";


export const SelectMeditationSessions = (state: AppState) => state.meditationSessions;
export const selectMeditationSessions = createSelector(
    SelectMeditationSessions,
    (state: MeditationSessionsState) => state.meditationSessions
);
export const selectmeditationSessionsStatus = createSelector(
    SelectMeditationSessions,
    (state: MeditationSessionsState) => state.status
);

export const selectMeditationSessionsError = createSelector(
    SelectMeditationSessions,
    (state) => state.error
);