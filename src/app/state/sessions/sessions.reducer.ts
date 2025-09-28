import { createReducer, on } from "@ngrx/store";
import { MeditationSession } from "../../models/data.models";
import { LoadSessions, LoadSessionsSuccess, LoadSessionsFailure } from "./sessions.actions";


export interface SessionsState {
    meditationSessions: MeditationSession[];
    next: string | null;
    previous: string | null;
    error: string;
    status: "pending" | "loading" | "error" | "success";
};


export const initialSessionsState: SessionsState = {
    meditationSessions: [],
    previous: null,
    next: null,
    error: "",
    status: 'pending' as 'pending',
};

export const SessionsReducer = createReducer(
    initialSessionsState,
    on(LoadSessions, (state) => ({
        ...state,
        status: 'loading' as 'loading',
    })),
    on(LoadSessionsSuccess, (state, { sessions, next, previous }) => ({
        ...state,
        meditationSessions: sessions,
        next: next,
        previous: previous,
        status: 'success' as 'success',
    })),
    on(LoadSessionsFailure, (state, { error }) => ({
        ...state,
        error,
        status: 'error' as 'error',
    }))
)