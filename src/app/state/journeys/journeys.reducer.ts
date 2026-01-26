import { createReducer, on } from "@ngrx/store";
import { LoadJourneys, LoadJourneysSuccess, LoadJourneysFailure } from "./journeys.actions";

import { Journey } from "../../models/data.models";


export interface JourneysState {
    journeys: Journey[];
    error: string;
    status: "pending" | "loading" | "error" | "success";
};


export const initialJourneysState: JourneysState = {
    journeys: [],
    error: "",
    status: 'pending' as 'pending',
};

export const JourneysReducer = createReducer(
    initialJourneysState,
    on(LoadJourneys, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(LoadJourneysSuccess, (state, { journeys: journeys }) => ({
        ...state,
        journeys: journeys,
        error: '',
        status: 'success' as 'success',
    })),
    on(LoadJourneysFailure, (state, { error }) => ({
        ...state,
        error: error,
        status: 'error' as 'error',
    }))
)