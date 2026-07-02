import { createReducer, on } from "@ngrx/store";
import { Announcement } from "../../models/data.models";
import { dismissAnnouncement, dismissAnnouncementFailure, dismissAnnouncementSuccess, LoadAnnouncements, LoadAnnouncementsFailure, LoadAnnouncementsSuccess } from "./announcement.actions";


export interface AnnouncementsState {
    announcements: Announcement[];
    seenBanner:boolean;
    error: string;
    status: "pending" | "loading" | "error" | "success";
};


export const initialAnnouncementsState: AnnouncementsState = {
    announcements: [],
    error: "",
    seenBanner:false,
    status: 'pending',
};

export const AnnouncementReducer = createReducer(
    initialAnnouncementsState,
    on(LoadAnnouncements, (state) => ({
        ...state,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(LoadAnnouncementsSuccess, (state, {announcements}) =>({
        ...state,
        announcements: announcements,
        status: 'success' as 'success',
        error: ''
    })),
    on(LoadAnnouncementsFailure, (state, {error}) => ({
        ...state,
        error: error,
        status: 'error' as 'error'
    })),
    on(dismissAnnouncement, (state) => ({
        ...state,
        seenBanner: true,
        status: 'loading' as 'loading',
        error: ''
    })),
    on(dismissAnnouncementSuccess, (state) => ({
        ...state,
        seenBanner: true,
        status: 'success' as 'success',
        error: ''
    })),
        on(dismissAnnouncementFailure, (state, {error}) => ({
        ...state,
        seenBanner: true,
        status: 'error' as 'error',
        error: error
    }))
)
