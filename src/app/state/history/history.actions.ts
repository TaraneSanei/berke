import { createAction, props } from "@ngrx/store";
import { CalendarSummary } from "../../models/data.models";

export const LoadCalendarSummary = createAction(
    '[backend] load calendar summary',
    props<{ startDate: string, endDate: string }>()
);

export const LoadCalendarSummarySuccess = createAction(
    '[backend] load calendar summary success',
    props<{ calendarSummary: CalendarSummary[] }>()
);

export const LoadCalendarSummaryFailure = createAction(
    '[backend] load calendar summary failure',
    props<{ error: string }>()
);
