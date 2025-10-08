import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DataService } from "../../shared/services/data.service";
import { AddJournal, AddJournalFailure, AddJournalSuccess, LoadJournal, LoadJournalFailure, LoadJournalSuccess } from "./journal.actions";
import { catchError, from, map, mergeMap, of } from "rxjs";


@Injectable()
export class JournalEffects {
    private actions$ = inject (Actions);
    private dataService = inject (DataService);
    
    constructor(){}

    
    addJournal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddJournal),
            mergeMap((action) => 
            from(this.dataService.addJournal(action.journal)).pipe(
                map((journal)=> AddJournalSuccess({journal: journal})),
                catchError((error) => of(AddJournalFailure({error})))
            ))));

    loadJournals$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadJournal),
            mergeMap((action) =>
                from(this.dataService.loadJournals(action.date)).pipe(
                    map((journals) => LoadJournalSuccess({ journals })),
                    catchError((error) => of(LoadJournalFailure({ error })))
                )
            )
        )
    );
}