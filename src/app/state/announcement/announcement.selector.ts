import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { AnnouncementsState } from "./announcement.reducer";


export const SelectAnnouncements = (state: AppState) => state.announcements
export const selectAnnouncements = createSelector(
    SelectAnnouncements,
    (state: AnnouncementsState) => state.announcements
)

export const selectTopAnnouncement = createSelector(
    SelectAnnouncements,
    (state: AnnouncementsState) => state.announcements[0]
)

export const selectSeenBanner = createSelector(
    SelectAnnouncements,
    (state: AnnouncementsState) => state.seenBanner
)