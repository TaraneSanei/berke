import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { BerkeComponent } from './berke/berke.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { JourneysComponent } from './journeys/journeys.component';
import { JournalComponent } from './journal/journal.component';
import { authGuard } from './auth/auth.guard';
import { PlayComponent } from './play/play.component';
import { meditationGuard } from './shared/guards/meditation.guard';
import { CourseComponent } from './course/course.component';
import { VerifyComponent } from './verify/verify.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, title:'ورود' },
    { path: 'preferences', component: PreferencesComponent, title:'شخصی سازی', canActivate:[authGuard] },
    { path: 'play/:trackId', component: PlayComponent, title:'مدیتیشن'},
    { path: '', component: BaseComponent, title:'برکه', canActivate:[authGuard], children:[
    {path: 'berke', component: BerkeComponent, title:'برکه'},
    {path: 'journeys', component: JourneysComponent, title:'سفرها'},
    {path: 'journal', component: JournalComponent, title:'روزنوشت'},
    {path: 'profile', component: ProfileComponent, title:'کاربر'},
    {path: 'course/:courseId', component: CourseComponent, title:'دوره'},
    {path: 'subscribe/:planId', component: SubscriptionComponent, title:'اشتراک' },
    {path: 'verify', component: VerifyComponent, title:'تایید' }
]},
{ path: '**', redirectTo: '' }
]
