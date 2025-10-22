import { createReducer, on } from "@ngrx/store";
import { JourneysSession } from "../../models/data.models";
import { LoadJourneysSessions, LoadJourneysSessionsSuccess, LoadJourneysSessionsFailure } from "./journeysSessions.actions";


export interface JourneysSessionsState {
    journeysSessions: JourneysSession[];
    next: string | null;
    previous: string | null;
    error: string;
    status: "pending" | "loading" | "error" | "success";
};


export const initialJourneysSessionsState: JourneysSessionsState = {
    journeysSessions: [],
    previous: null,
    next: null,
    error: "",
    status: 'pending' as 'pending',
};

export const JourneysSessionsReducer = createReducer(
    initialJourneysSessionsState,
    on(LoadJourneysSessions, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(LoadJourneysSessionsSuccess, (state, { JourneysSessions: sessions, next, previous }) => ({
        ...state,
        journeysSessions: sessions,
        next: next,
        previous: previous,
        error: '',
        status: 'success' as 'success',
    })),
    on(LoadJourneysSessionsFailure, (state, { error }) => ({
        ...state,
        error,
        status: 'error' as 'error',
    }))
)