import { createAction, props } from "@ngrx/store";
import { Journal } from "../../models/data.models";


// load journals based on the selected date actions

export const LoadJournal = createAction(
    '[backend] load journal',
    props<{ date: string }>()
);

export const LoadJournalSuccess = createAction(
    '[backend] load journal success',
    props<{ journals: Journal[] }>()
);

export const LoadJournalFailure = createAction(
    '[backend] load journal failure',
    props<{ error: string }>()
);

//add a new journal note actions


export const AddJournal = createAction(
    '[backend] add journal',
    props<{journal: Journal}>()
);

export const AddJournalSuccess = createAction(
    '[backend] add journal success',
    props<{journal: Journal}>()
);

export const AddJournalFailure = createAction(
    '[backend] add journal failure',
    props<{error: string}>()
);


//Edit journal actions

export const EditJournal = createAction(
    '[backend] edit journal',
    props<{journal: Journal}>()
);

export const EditJournalSuccess = createAction(
    '[backend] edit journal success',
    props<{journal: Journal}>()
);

export const EditJournalFailure = createAction(
    '[backend] edit journal failure',
    props<{error: string}>()
);

//delete journal actions

export const DeleteJournal = createAction(
    '[backend] delete journal',
    props<{journalEntry: Journal}>()
);

export const DeleteJournalSuccess = createAction(
    '[backend] delete journal success',
    props<{journalEntry: Journal}>()
);

export const DeleteJournalFailure = createAction(
    '[backend] delete journal failure',
    props<{error: string}>()
);
