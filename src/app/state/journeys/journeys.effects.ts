import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, from, map, catchError, of, switchMap } from "rxjs";
import { LoadJourneys, LoadJourneysFailure, LoadJourneysSuccess } from "./journeys.actions";
import { DataService } from "../../shared/services/data.service";



@Injectable()
export class JourneysEffects
 {
    private actions$ = inject (Actions);
    private dataService = inject (DataService);

    constructor(){}

    loadJourneys$ = createEffect(() =>
    this.actions$.pipe(
        ofType(LoadJourneys),
        switchMap(() => this.dataService.getJourneysSessions()), // Get the JourneysSession[]
            switchMap(rawSessions => 
            this.dataService.makeJourneys(rawSessions)
        ),
        map(journeys => 
            LoadJourneysSuccess({ journeys: journeys }) // Dispatch the fully normalized data
        ),
        catchError((response) => of(LoadJourneysFailure({error: response.error})))
    ));
    }