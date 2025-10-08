import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, from, map, catchError, of } from "rxjs";
import { LoadSessions, LoadSessionsFailure, LoadSessionsSuccess } from "./sessions.actions";
import { DataService } from "../../shared/services/data.service";




@Injectable()
export class SessionsEffects {
    private actions$ = inject (Actions);
    private dataService = inject (DataService);

    constructor(){}

    loadsessions$ = createEffect(()=>
    this.actions$.pipe(
        ofType(LoadSessions),
        mergeMap((action) => 
        from(this.dataService.getSessions(action.url)).pipe(
            map((response) => LoadSessionsSuccess({sessions:response.results, next: response.next, previous: response.previous})),
            catchError((error) => of(LoadSessionsFailure({error})))
        ))));
    }