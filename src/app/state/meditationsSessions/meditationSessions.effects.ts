import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DataService } from "../../shared/services/data.service";
import { catchError, from, map, mergeMap, of } from "rxjs";
import { AddMeditationSession, AddMeditationSessionFailure, AddMeditationSessionSuccess, LoadMeditationSession, LoadMeditationSessionSuccess, UpdateMeditationSession, UpdateMeditationSessionFailure, UpdateMeditationSessionSuccess } from "./meditationSessions.actions";
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

    addMeditationSession = createEffect(() =>
    this.actions$.pipe(
        ofType(AddMeditationSession),
        mergeMap((action) => 
        from(this.dataService.addMeditationSession(action.session)).pipe(
            map((meditationSession) => AddMeditationSessionSuccess({ session: meditationSession})),
            catchError((response) => of(AddMeditationSessionFailure({error:response.error})))
        ))));

    updateMeditationSession = createEffect(() =>
    this.actions$.pipe(
        ofType(UpdateMeditationSession),
        mergeMap((action) => 
        from(this.dataService.updateMeditationSession(action.session)).pipe(
            map((meditationSession) => UpdateMeditationSessionSuccess({ session: meditationSession})),
            catchError((response) => of(UpdateMeditationSessionFailure({error:response.error})))
        ))));
}