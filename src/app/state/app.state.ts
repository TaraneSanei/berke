import { OTPState } from "./otp/otp.reducer";
import { UiState } from "./UI/ui.reducer";
import { UserState } from "./user/user.reducer";
import { SessionsState } from "./sessions/sessions.reducer";
import { JournalState } from "./journal/journal.reducer";
import { EmotionState } from "./emotion/emotion.reducer";

export interface AppState {
  user: UserState;
  otp: OTPState;
  ui: UiState;
  sessions: SessionsState;
  journal: JournalState;
  emotions: EmotionState;

}