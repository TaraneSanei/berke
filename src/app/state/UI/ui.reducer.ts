import { createReducer, on } from "@ngrx/store";
import { startLoading, stopLoading } from "./ui.actions";


export interface UiState {
    loading: boolean;
}

const initialUiState: UiState = {
    loading: false
};


export const uiReducer = createReducer(
  initialUiState,
  on(startLoading, () => ({ loading: true })),
  on(stopLoading, () => ({ loading: false }))
);