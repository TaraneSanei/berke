import { createReducer, on } from "@ngrx/store";
import { MeditationSession } from "../../models/data.models";
import { LoadMeditationSession, LoadMeditationSessionFailure, LoadMeditationSessionSuccess } from "./meditationSessions.actions";


export interface MeditationSessionsState {
    meditationSessions: MeditationSession[];
    error: string;
    status: "pending" | "loading" | "error" | "success";
};


export const initialmeditationSessionsState: MeditationSessionsState = {
    meditationSessions: [],
    error: "",
    status: 'pending',
};

export const meditationSessionsReducer = createReducer(
    initialmeditationSessionsState,
    on(LoadMeditationSession, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(LoadMeditationSessionSuccess, (state, {sessions}) => ({
        ...state,
        meditationSessions: sessions,
        status: 'success' as 'success',
        error: ''
    })),
    on(LoadMeditationSessionFailure, (state, {error}) => ({
        ...state,
        error: error,
        status: 'error' as 'error'
    }))
)

