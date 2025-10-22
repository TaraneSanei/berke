import { createAction, props } from "@ngrx/store";
import { JourneysSession } from "../../models/data.models";

export const LoadJourneysSessions = createAction(
    '[backend] load sessions for the journeys section',
    props<{ url: string | null}>()
);

export const LoadJourneysSessionsSuccess = createAction(
    '[backend] load sessions for the journeys section success',
    props<{ JourneysSessions: JourneysSession[], next: string, previous: string }>()
);

export const LoadJourneysSessionsFailure = createAction(
    '[backend] load sessions for the journeys section failure',
    props<{ error: string }>()
);