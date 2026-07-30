import { APP_INITIALIZER, ApplicationConfig, inject, isDevMode, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { CookieService } from 'ngx-cookie-service';
import { providePrimeNG } from 'primeng/config';
import { aurora, forest, morning, mountain, neutral, sunrise, sunset } from '../mypresets';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { UserEffects } from './state/user/user.effects';
import { UserReducer } from './state/user/user.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authInterceptor } from './auth/auth.interceptor';
import { OtpReducer } from './state/otp/otp.reducer';
import { OTPEffects } from './state/otp/otp.effects';
import { loadingInterceptor } from './loading/loading.interceptor';
import { uiReducer } from './state/UI/ui.reducer';
import { JourneysReducer } from './state/journeys/journeys.reducer';
import { JourneysEffects } from './state/journeys/journeys.effects';
import { JournalReducer } from './state/journal/journal.reducer';
import { JournalEffects } from './state/journal/journal.effects';
import { MeditationSessionsEffects } from './state/meditationsSessions/meditationSessions.effects';
import { meditationSessionsReducer } from './state/meditationsSessions/meditationSessions.reducer';
import { calendarReducer } from './state/history/history.reducer';
import { CalendarEffects } from './state/history/history.effects';
import { BerkeService } from './shared/services/berke.service';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { MessageService } from 'primeng/api';
import { AnnouncementReducer } from './state/announcement/announcement.reducer';
import { AnnouncementEffects } from './state/announcement/announcement.effects';
import { clearStateMetaReducer } from './state/meta-reducers/clear-state.reducer';
import { orderReducer } from './state/order/order.reducer';
import { OrderEffects } from './state/order/order.effects';



export const appConfig: ApplicationConfig = {
  providers: [
    //Angular configurations
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    MessageService,
    //cookie service
    CookieService,
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        authInterceptor,
        loadingInterceptor
      ])
    ),
    //ngrx
    provideStore({
      user: UserReducer,
      otp: OtpReducer,
      ui: uiReducer,
      journeys: JourneysReducer,
      journal: JournalReducer,
      meditationSessions: meditationSessionsReducer,
      calendar: calendarReducer,
      announcements: AnnouncementReducer,
      order: orderReducer

    }, {
      metaReducers: [clearStateMetaReducer]
    }),
    provideEffects([
      UserEffects,
      OTPEffects,
      JourneysEffects,
      JournalEffects,
      MeditationSessionsEffects,
      CalendarEffects,
      AnnouncementEffects,
      OrderEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    }),
    //PrimeNG
    providePrimeNG({
      theme: {
        preset: neutral, options: {
          darkModeSelector: false
        }
      }
    }),
    provideAppInitializer(() => {
      const berkeService = inject(BerkeService);
      return berkeService.initializeAppTheme();
    })
  ],
};
