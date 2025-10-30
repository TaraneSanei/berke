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


export const AddMeditationSession = createAction(
    '[backend] add meditation session',
    props<{session: MeditationSession}>()
);

export const AddMeditationSessionSuccess = createAction(
    '[backend] add meditation session success',
    props<{session: MeditationSession}>()
);

export const AddMeditationSessionFailure = createAction(
    '[backend] add meditation session failure',
    props<{error: string}>()
);


//Edit meditation session actions

export const EditMeditationSession = createAction(
    '[backend] edit meditation session',
    props<{session: MeditationSession}>()
);

export const EditMeditationSessionSuccess = createAction(
    '[backend] edit meditation session success',
    props<{session: MeditationSession}>()
);

export const EditMeditationSessionFailure = createAction(
    '[backend] edit meditation session failure',
    props<{error: string}>()
);