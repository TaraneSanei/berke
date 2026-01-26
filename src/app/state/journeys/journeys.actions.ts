import { createAction, props } from "@ngrx/store";
import { Journey, JourneysSession } from "../../models/data.models";

export const LoadJourneys = createAction(
    '[backend] load journeys',
);

export const LoadJourneysSuccess = createAction(
    '[backend] load journeys success',
    props<{ journeys: Journey[] }>()
);

export const LoadJourneysFailure = createAction(
    '[backend] load journeys sessions failure',
    props<{ error: string }>()
);