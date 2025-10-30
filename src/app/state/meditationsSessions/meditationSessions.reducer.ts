import { createReducer, on } from "@ngrx/store";
import { MeditationSession } from "../../models/data.models";
import { AddMeditationSession, AddMeditationSessionFailure, AddMeditationSessionSuccess, EditMeditationSession, EditMeditationSessionFailure, EditMeditationSessionSuccess, LoadMeditationSession, LoadMeditationSessionFailure, LoadMeditationSessionSuccess } from "./meditationSessions.actions";


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
    })),
        on(AddMeditationSession, (state) => ({
            ...state,
            status: 'loading' as 'loading',
            error: ''
        })),
        on(AddMeditationSessionSuccess, (state, {session}) => ({
            ...state,
            meditationSessions: [...state.meditationSessions, session],
            status: 'success' as 'success',
            error: ''
        })),
        on(AddMeditationSessionFailure, (state, {error}) => ({
            ...state,
            error,
            status: 'error' as 'error'
        })),
        on(EditMeditationSession, (state) => ({
            ...state,
            status: 'loading' as 'loading'
        })),
        on(EditMeditationSessionSuccess, (state, {session}) => ({
            ...state,
            meditationSessions: state.meditationSessions.map((s) => (s.id === session.id ? session : s)),
            status: 'success' as 'success'
        })),
        on(EditMeditationSessionFailure, (state, {error}) => ({
            ...state,
            error,
            status: 'error' as 'error'
        })),
)

