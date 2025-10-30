import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DataService } from "../../shared/services/data.service";
import { LoadCalendarSummary, LoadCalendarSummaryFailure, LoadCalendarSummarySuccess } from "./history.actions";
import { catchError, from, map, mergeMap, of } from "rxjs";



@Injectable()
export class CalendarEffects {
    private actions$ = inject(Actions);
    private dataService = inject(DataService);

    loadCalendar$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadCalendarSummary),
            mergeMap((action) =>
                from(this.dataService.getMonthSummary(action.startDate, action.endDate)).pipe(
                    map((summary) => LoadCalendarSummarySuccess({ calendarSummary: summary })),
                    catchError((response) => of(LoadCalendarSummaryFailure({ error: response.error })))
                )
            )))
} 