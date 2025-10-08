import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, from, map, catchError, of } from "rxjs";
import { DataService } from "../../shared/services/data.service";
import { LoadEmotions, LoadEmotionsSuccess, LoadEmotionsFailure } from "./emotion.actions";



@Injectable()
export class EmotionEffects {
        private actions$ = inject (Actions);
        private dataService = inject (DataService);
        

    loadEmotions$ = createEffect(() =>
    this.actions$.pipe(
        ofType(LoadEmotions),
        mergeMap((action) =>
        from(this.dataService.getEmotions()).pipe(
            map((response) => LoadEmotionsSuccess({emotions: response})),
            catchError((error)=> of(LoadEmotionsFailure({error: error})))
        ))));
}