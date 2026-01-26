import { OTPState } from "./otp/otp.reducer";
import { UiState } from "./UI/ui.reducer";
import { UserState } from "./user/user.reducer";
import { JournalState } from "./journal/journal.reducer";
import { MeditationSessionsState } from "./meditationsSessions/meditationSessions.reducer";
import { CalendarState } from "./history/history.reducer";
import { JourneysState } from "./journeys/journeys.reducer";

export interface AppState {
  user: UserState;
  otp: OTPState;
  ui: UiState;
  journeys: JourneysState;
  journal: JournalState;
  meditationSessions: MeditationSessionsState;
  calendar: CalendarState;
}