import { createAction, props } from "@ngrx/store";
import { MeditationSession } from "../../models/data.models";

export const LoadSessions = createAction(
    '[backend] load sessions',
    props<{ url: string | null}>()
);

export const LoadSessionsSuccess = createAction(
    '[backend] load sessions success',
    props<{ sessions: MeditationSession[], next: string, previous: string }>()
);

export const LoadSessionsFailure = createAction(
    '[backend] load sessions failure',
    props<{ error: string }>()
);