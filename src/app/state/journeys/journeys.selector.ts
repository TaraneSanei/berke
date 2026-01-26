import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { JourneysState } from "./journeys.reducer";



export const SelectJourneys = (state: AppState) => state.journeys;
export const selectJourneys = createSelector(
    SelectJourneys,
    (state: JourneysState) => state.journeys
);

export const selectJourneysError = createSelector(
    SelectJourneys,
    (state: JourneysState) => state.error
);