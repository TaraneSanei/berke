import { createAction, props } from "@ngrx/store";
import { Announcement } from "../../models/data.models";

export const LoadAnnouncements = createAction(
    '[backend] load active Announcement'
);

export const LoadAnnouncementsSuccess = createAction(
    '[backend] load journal success',
    props<{ announcements: Announcement[] }>()
);

export const LoadAnnouncementsFailure = createAction(
    '[backend] load journal failure',
    props<{ error: string }>()
);

export const dismissAnnouncement = createAction(
    'dissmiss the announcement permenantly',
    props<{id: string}>()
)

export const dismissAnnouncementSuccess = createAction(
    'successfully dissmissed the announcement permenantly'
)


export const dismissAnnouncementFailure = createAction(
    'failed to dissmiss the announcement permenantly',
    props<{error: string}>()
)