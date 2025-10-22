import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DataService } from "../../shared/services/data.service";
import { catchError, from, map, mergeMap, of } from "rxjs";
import { LoadMeditationSession, LoadMeditationSessionSuccess } from "./meditationSessions.actions";
import { LoadJourneysSessionsFailure } from "../JourneysSessions/journeysSessions.actions";

@Injectable()
export class MeditationSessionsEffects {
    private actions$ = inject(Actions);
    private dataService = inject(DataService);

    loadMeditationSessions = createEffect(() =>
    this.actions$.pipe(
        ofType(LoadMeditationSession),
        mergeMap((action) => 
        from(this.dataService.loadMeditationSessions(action.date)).pipe(
            map((meditationSessions) => LoadMeditationSessionSuccess({ sessions: meditationSessions})),
            catchError((response) => of(LoadJourneysSessionsFailure({error:response.error})))
        ))));
}