import { Component } from '@angular/core';
import { WindowDirective } from '../directives/window.directive';
import { Button, ButtonModule } from "primeng/button";
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { PersianDigitsDirective } from '../directives/persian-digits.directive';
import { PersianDigitsPipe } from '../pipes/persian-digits.pipe';
import { CalendarModule } from 'primeng/calendar';
import { BerkeService } from '../berke.service';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { setPreferences, updateProfile } from '../state/user/user.actions';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-preferences',
  imports: [
    PersianDigitsDirective,
    WindowDirective,
    ButtonModule,
    StepperModule,
    InputTextModule,
    CommonModule,
    SelectButtonModule,
    CheckboxModule,
    FormsModule,
    DatePickerModule
],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent {

  notificationTime = new Date()

  activeStep: number = 1;
  direction: 'up' | 'down' = 'up'; //stepper direction
  preferences = {
  username: '',
  experience: '',
  goals: [] as string[],
  theme: '',
  notifications: true,
  notificationTime: '',
  subscription: false
};

  constructor(private berkeservice: BerkeService, private store: Store<AppState>, private router: Router, private notificationservice: NotificationService) {}

  goToStep(step: number) {
    if (step === this.activeStep) return;
    this.direction = step > this.activeStep ? 'up' : 'down';
    this.activeStep = step;
  }

  setExperience(experience: string) {
    this.preferences.experience = experience;
    this.goToStep(4)
  }

  setGoals(goal: string) {
    if (this.preferences.goals.includes(goal)){
      this.preferences.goals = this.preferences.goals.filter((g)=> g!== goal)
    } else {
    this.preferences.goals.push(goal)
    }
  }

  setNotificationsLater(){
    this.preferences.notifications = false;
  }

  setNotifications(){
    this.notificationservice.requestPermission()
  }

  toPersianDigits(value: string): string {
  return value ? value.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]) : '';
}

  themeChange(theme: string) {
    this.preferences.theme = theme;
    this.berkeservice.setTheme(theme as 'sunrise' | 'sunset' | 'forest' | 'aurora'| 'mountain' | 'morning');
  }

  subscribe(){
    this.router.navigate(['/subscribe']);

  }

  start() {
    this.router.navigate(['/']);
}

  updatePreferences (){
    this.preferences.notificationTime = this.notificationTime.getHours().toString() +":"+ this.notificationTime.getMinutes().toString() + ':00'
    console.log(this.preferences.notificationTime)
    this.store.dispatch((setPreferences({preferences: this.preferences})))
  }

  
}
