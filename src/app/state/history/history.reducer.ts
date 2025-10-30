import { createReducer, on } from "@ngrx/store";
import { CalendarSummary } from "../../models/data.models";
import { LoadCalendarSummary, LoadCalendarSummaryFailure, LoadCalendarSummarySuccess } from "./history.actions";



export interface CalendarState {
    calendar: CalendarSummary[];
    error: string;
    status: "pending" | "loading" | "error" | "success";
};

export const initialCalendarState: CalendarState = {
    calendar: [],
    error: '',
    status: 'pending'
};

export const calendarReducer = createReducer(
    initialCalendarState,
    on(LoadCalendarSummary, (state) =>({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(LoadCalendarSummarySuccess, (state, { calendarSummary }) =>({
        ...state,
        calendar: calendarSummary,
        status: 'success' as 'success',
        error: ''
    })),
    on(LoadCalendarSummaryFailure, (state, { error }) =>({
        ...state,
        status: 'error' as 'error',
        error: error
    }))
)
