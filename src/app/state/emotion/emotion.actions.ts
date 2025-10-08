import { createAction, props } from "@ngrx/store";
import { Emotion } from "../../models/data.models";

export const LoadEmotions = createAction(
    '[backend] load emotions'
);

export const LoadEmotionsSuccess = createAction(
    '[backend] load emotions success',
    props<{emotions: Emotion[]}>()
);

export const LoadEmotionsFailure = createAction(
    '[backend] loading emotions failure',
    props<{error:string}>()
);
