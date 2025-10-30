import { Component, effect, signal } from '@angular/core';
import { BerkeService } from '../shared/services/berke.service';
import { CommonModule } from '@angular/common';
import { WindowDirective } from "../shared/directives/window.directive";
import { User } from '../models/data.models';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectUser } from '../state/user/user.selector';
import { PersianDigitsDirective } from '../shared/directives/persian-digits.directive';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { InputTextModule } from 'primeng/inputtext';
import { changePassword, updateProfile } from '../state/user/user.actions';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { JalaliDatePipe } from '../shared/pipes/jalali-date.pipe';
@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    WindowDirective,
    PersianDigitsPipe,
    JalaliDatePipe,
    ButtonModule,
    AvatarGroupModule,
    AvatarModule,
    BadgeModule,
    OverlayBadgeModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  expanded = signal<('user' | 'settings' | 'subscription')[]>([])
  isEditingUserName = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);
  passwordRepeatFocused = signal<boolean>(false);

  editableUserProfile: User = {
    phoneNumber: '',
    username: '',
    authenticated: false,
    isSubscribed: false,
    minutesListened: 0,
    theme: ''
  }
  changePasswordForm: FormGroup;

  constructor(private berkeservice: BerkeService, private store: Store<AppState>, private fb: FormBuilder) {
    
    this.selectedTheme = localStorage.getItem('user-theme') || 'sunrise';

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatNewPassword: ['', Validators.required]
    ,},{
  validators: this.passwordMatchValidator()
});

    effect(() => {
      const profileData = this.store.selectSignal(selectUser)
      this.UserProfile.set(profileData())
    })

  }

  UserProfile = signal<User | null>(null)
  selectedTheme!: string;
  themes = [
    { label: 'طلوع', value: 'sunrise' },
    { label: 'غروب', value: 'sunset' },
    { label: 'جنگل', value: 'forest' }
  ];

  themeChange(theme: string) {
    this.selectedTheme = theme;
    this.berkeservice.setTheme(theme as 'sunrise' | 'sunset' | 'forest');
  }

  toggleExpanded(panel: 'user' | 'settings' | 'subscription') {
    if (this.expanded().includes(panel)) {
      this.expanded.set(this.expanded().filter(p => p !== panel));
    } else {
      this.expanded.set([...this.expanded(), panel]);
      console.log('the session should collapse now')
    }
  }

  startEditUsername() {
    this.editableUserProfile = {
      phoneNumber: this.UserProfile() ? this.UserProfile()?.phoneNumber! : '',
      username: this.UserProfile() ? this.UserProfile()?.username : '',
      authenticated: this.UserProfile() ? this.UserProfile()?.authenticated! : false,
      isSubscribed: this.UserProfile() ? this.UserProfile()?.isSubscribed! : false,
      minutesListened: this.UserProfile() ? this.UserProfile()?.minutesListened! : 0,
      theme: this.UserProfile() ? this.UserProfile()?.theme! : ''
    }
    this.isEditingUserName.set(!this.isEditingUserName());

  }

  editUsername() {
    this.store.dispatch(updateProfile({ user: this.editableUserProfile }));
    this.isEditingUserName.set(false);
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword')?.value;
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword')?.value;
  }

  get repeatNewPassword() {
    return this.changePasswordForm.get('repeatNewPassword')?.value;
  }

  
  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('newPassword')?.value;
      const repeatPassword = form.get('repeatNewPassword')?.value;

      return password === repeatPassword ? null : { passwordMismatch: true };
    };
  }

  toggleChangePassword() {
    if(!this.isChangingPassword()){
      this.isChangingPassword.set(true);
    } else {
      this.isChangingPassword.set(false);
      this.changePasswordForm.reset();
    }
  }

  changePassword() {
    this.store.dispatch(changePassword({ oldPassword: this.oldPassword, newPassword: this.newPassword }));
    this.isChangingPassword.set(false);
    this.changePasswordForm.reset();
  }
}
