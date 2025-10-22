import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { JourneysSessionsState } from "./journeysSessions.reducer";



export const SelectJourneysSessions = (state: AppState) => state.journeysSessions;
export const selectJourneysSessions = createSelector(
    SelectJourneysSessions,
    (state: JourneysSessionsState) => state.journeysSessions
);
export const selectNext = createSelector(
    SelectJourneysSessions,
    (state: JourneysSessionsState) => state.next
);
export const selectPrevious = createSelector(
    SelectJourneysSessions,
    (state: JourneysSessionsState) => state.previous
);
export const selectError = createSelector(
    SelectJourneysSessions,
    (state: JourneysSessionsState) => state.error
);