import { createSelector } from "@ngrx/store";
import { AppState } from "../app.state";
import { JournalState } from "./journal.reducer";


export const Selectjournal = (state: AppState) => state.journal;
export const selectJournal = createSelector(
    Selectjournal,
    (state: JournalState) => state.journals
);
export const selectJournalError = createSelector(
    Selectjournal,
    (state: JournalState) => state.error
);