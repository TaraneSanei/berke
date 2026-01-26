import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { CalendarState } from "./history.reducer";


export const SelectCalendar = (state: AppState) => state.calendar;
export const selectCalendar = createSelector(
    SelectCalendar,
    (state: CalendarState) => state.calendar
)

export const selectCalendarError = createSelector(
    SelectCalendar,
    (state: CalendarState) => state.error
)