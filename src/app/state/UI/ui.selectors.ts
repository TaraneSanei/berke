import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { UiState } from "./ui.reducer";



export const SelectUi = (state: AppState) => state.ui;
export const selectLoading = createSelector(
    SelectUi,
    (state: UiState) => state.loading
);
