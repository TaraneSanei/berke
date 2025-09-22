import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { BerkeComponent } from './berke/berke.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, title:'login' },
    { path: 'signup', component: SignupComponent, title:'signup' },
    { path: 'preferences', component: PreferencesComponent, title:'preferences' },
    { path: '', component: BaseComponent, title:'base', children:[
    
    {path: 'berke', component: BerkeComponent, title:'berke'},
    {path: 'profile', component: ProfileComponent, title:'profile'},
]},

]
