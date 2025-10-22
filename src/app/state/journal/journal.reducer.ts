import { createReducer, on } from "@ngrx/store";
import { Journal } from "../../models/data.models";
import { AddJournal, AddJournalFailure, AddJournalSuccess, DeleteJournal, DeleteJournalFailure, DeleteJournalSuccess, EditJournal, EditJournalFailure, EditJournalSuccess, LoadJournal, LoadJournalFailure, LoadJournalSuccess } from "./journal.actions";



export interface JournalState {
    journals: Journal[];
    error: string;
    status: "pending" | "loading" | "error" | "success";
};


export const initialJournalState: JournalState = {
    journals: [],
    error: "",
    status: 'pending',
};


export const JournalReducer = createReducer(
    initialJournalState,
    on(LoadJournal, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(LoadJournalSuccess, (state, {journals}) => ({
        ...state,
        journals: journals,
        status: 'success' as 'success',
        error: ''
    })),
    on(LoadJournalFailure, (state, {error}) => ({
        ...state,
        error,
        status: 'error' as 'error'
    })),
    on(AddJournal, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(AddJournalSuccess, (state, {journal}) => ({
        ...state,
        journals: [...state.journals, journal],
        status: 'success' as 'success',
        error: ''
    })),
    on(AddJournalFailure, (state, {error}) => ({
        ...state,
        error,
        status: 'error' as 'error'
    })),
    on(EditJournal, (state) => ({
        ...state,
        status: 'loading' as 'loading'
    })),
    on(EditJournalSuccess, (state, {journal}) => ({
        ...state,
        journals: state.journals.map((j) => (j.id === journal.id ? journal : j)),
        status: 'success' as 'success'
    })),
    on(EditJournalFailure, (state, {error}) => ({
        ...state,
        error,
        status: 'error' as 'error'
    })),
    on(DeleteJournal, (state) => ({
        ...state,
        status: 'loading' as 'loading'
    })),
    on(DeleteJournalSuccess, (state, {journal}) => ({
        ...state,
        journals: state.journals.filter((j) => j.id !== journal.id),
        status: 'success' as 'success'
    })),
    on(DeleteJournalFailure, (state, {error}) => ({
        ...state,
        error,
        status: 'error' as 'error'
    }))
)