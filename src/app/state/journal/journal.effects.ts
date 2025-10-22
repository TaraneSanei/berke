import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DataService } from "../../shared/services/data.service";
import { AddJournal, AddJournalFailure, AddJournalSuccess, DeleteJournal, DeleteJournalFailure, DeleteJournalSuccess, EditJournal, EditJournalFailure, EditJournalSuccess, LoadJournal, LoadJournalFailure, LoadJournalSuccess } from "./journal.actions";
import { catchError, from, map, mergeMap, of } from "rxjs";


@Injectable()
export class JournalEffects {
    private actions$ = inject(Actions);
    private dataService = inject(DataService);

    constructor() { }


    addJournal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AddJournal),
            mergeMap((action) =>
                from(this.dataService.addJournal(action.journal)).pipe(
                    map((journal) => AddJournalSuccess({ journal: journal })),
                    catchError((response) => of(AddJournalFailure({ error:response.error })))
                ))));

    loadJournals$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadJournal),
            mergeMap((action) =>
                from(this.dataService.loadJournals(action.date)).pipe(
                    map((journals) => LoadJournalSuccess({ journals })),
                    catchError((response) => of(LoadJournalFailure({ error:response.error })))
                ))));

    deleteJournal$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DeleteJournal),
            mergeMap((action) =>
                from(this.dataService.deleteJournal(action.journal)).pipe(
                    map(() => DeleteJournalSuccess({ journal: action.journal })),
                    catchError((response) => of(DeleteJournalFailure({ error: response.error })))
                ))));

    editJournal$ = createEffect(() =>
    this.actions$.pipe(
        ofType(EditJournal),
        mergeMap((action) =>
            from(this.dataService.editJournal(action.journal)).pipe(
                map((journal) => EditJournalSuccess({journal:journal})),
                catchError((response) => of(EditJournalFailure({error: response.error})))
            ))))
}