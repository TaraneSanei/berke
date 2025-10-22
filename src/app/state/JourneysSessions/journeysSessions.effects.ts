import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, from, map, catchError, of } from "rxjs";
import { LoadJourneysSessions, LoadJourneysSessionsFailure, LoadJourneysSessionsSuccess } from "./journeysSessions.actions";
import { DataService } from "../../shared/services/data.service";




@Injectable()
export class JourneysSessionsEffects
 {
    private actions$ = inject (Actions);
    private dataService = inject (DataService);

    constructor(){}

    loadsessions$ = createEffect(()=>
    this.actions$.pipe(
        ofType(LoadJourneysSessions),
        mergeMap((action) => 
        from(this.dataService.getJourneysSessions(action.url)).pipe(
            map((response) => LoadJourneysSessionsSuccess({JourneysSessions:response.results, next: response.next, previous: response.previous})),
            catchError((response) => of(LoadJourneysSessionsFailure({error: response.error})))
        ))));
    }