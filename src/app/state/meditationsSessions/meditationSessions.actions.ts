import { createAction, props } from "@ngrx/store";
import { MeditationSession } from "../../models/data.models";

export const LoadMeditationSession = createAction(
    '[backend] load meditation sessions for the journal section',
    props<{ date: string }>()
);

export const LoadMeditationSessionSuccess = createAction(
    '[backend] load  meditation sessions for the journal section success',
    props<{ sessions: MeditationSession[] }>()
);

export const LoadMeditationSessionFailure = createAction(
    '[backend] load  meditation sessions for the journal section failure',
    props<{ error: string }>()
);
