import { OTPState } from "./otp/otp.reducer";
import { UiState } from "./UI/ui.reducer";
import { UserState } from "./user/user.reducer";
import { JourneysSessionsState } from "./JourneysSessions/journeysSessions.reducer";
import { JournalState } from "./journal/journal.reducer";
import { MeditationSessionsState } from "./meditationsSessions/meditationSessions.reducer";

export interface AppState {
  user: UserState;
  otp: OTPState;
  ui: UiState;
  journeysSessions: JourneysSessionsState;
  journal: JournalState;
  meditationSessions: MeditationSessionsState
}