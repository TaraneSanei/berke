import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { BerkeComponent } from './berke/berke.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { JourneysComponent } from './journeys/journeys.component';
import { JournalComponent } from './journal/journal.component';
import { authGuard } from './auth/auth.guard';
import { PlayComponent } from './play/play.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, title:'login' },
    { path: 'signup', component: SignupComponent, title:'signup' },
    { path: 'preferences', component: PreferencesComponent, title:'preferences' },
    { path: 'subscribe', component: SubscriptionComponent, title:'subscribe' },
    { path: 'play/:trackId', component: PlayComponent, title:'play' },
    { path: '', component: BaseComponent, title:'base', canActivate:[authGuard], children:[
    {path: 'berke', component: BerkeComponent, title:'berke'},
    {path: 'journeys', component: JourneysComponent, title:'journeys'},
    {path: 'journal', component: JournalComponent, title:'journal'},
    {path: 'profile', component: ProfileComponent, title:'profile'},
]},
]
