import { inject, Injectable } from "@angular/core";
import { BerkeService } from "../../shared/services/berke.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { dismissAnnouncement, dismissAnnouncementFailure, dismissAnnouncementSuccess, LoadAnnouncements, LoadAnnouncementsFailure, LoadAnnouncementsSuccess } from "./announcement.actions";
import { catchError, from, map, mergeMap, of } from "rxjs";

@Injectable()
export class AnnouncementEffects {
    private actions$ = inject(Actions);
    private berkeService = inject(BerkeService);
    constructor(){}

    loadAnnouncements$ = createEffect(() => 
    this.actions$.pipe(
        ofType(LoadAnnouncements),
        mergeMap((action) =>
        from(this.berkeService.loadAnnouncements()).pipe(
        map((announcements) => LoadAnnouncementsSuccess({announcements})),
    catchError((response) => of(LoadAnnouncementsFailure({error:response.error})))))
    ))

    dismissAnnouncement$ = createEffect(() =>
    this.actions$.pipe(
        ofType(dismissAnnouncement),
        mergeMap((action) =>
        from(this.berkeService.dismissAnnouncement(action.id)).pipe(
           map(() => dismissAnnouncementSuccess()),
           catchError((error) => of(dismissAnnouncementFailure({error:error}))) 
        )
        )
    ))
}