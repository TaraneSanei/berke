import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { BerkeService } from '../shared/services/berke.service';
import { CommonModule } from '@angular/common';
import { WindowDirective } from "../shared/directives/window.directive";
import { User } from '../models/data.models';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectUser } from '../state/user/user.selector';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { InputTextModule } from 'primeng/inputtext';
import { changePassword, logout, updateProfile } from '../state/user/user.actions';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { JalaliDatePipe } from '../shared/pipes/jalali-date.pipe';
import { SupportService } from '../shared/services/support.service';
import { CutoutService } from '../shared/services/cutout.service';
import { Dialog } from 'primeng/dialog';
import { ManagePasswordComponent } from "../shared/components/manage-password/manage-password.component";
import { ManageThemeComponent } from "../shared/components/manage-theme/manage-theme.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

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
    ReactiveFormsModule,
    Dialog,
    ManagePasswordComponent,
    ManageThemeComponent,
    ConfirmDialogModule
],
providers:[ConfirmationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private confirmationService= inject(ConfirmationService);
  private cutoutService = inject(CutoutService);
  private supportService = inject(SupportService);
  private berkeService = inject(BerkeService);
  expanded = signal<('user' | 'settings' | 'subscription' | 'badges' | 'about')[]>([])
  isEditingUserName = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);
  isChangingTheme = signal<boolean>(false);
  isChangingNotification = signal<boolean>(false);
  UserProfile = signal<User | null>(null)
  selectedTheme = this.berkeService.userTheme
  themeName: string;
  themes = [
    { label: 'طلوع', value: 'sunrise', background: 'linear-gradient(var(--p-pink-700), var(--p-purple-900), var(--p-purple-950))' },
    { label: 'غروب', value: 'sunset', background: 'linear-gradient(var(--p-purple-950), var(--p-purple-800), var(--p-orange-400))' },
    { label: 'صبح', value: 'morning', background: 'linear-gradient(var(--p-sky-600), var(--p-blue-300))' },
    { label: 'جنگل', value: 'forest', background: 'url("/assets/bg-images/forest.jpg")' },
    { label: 'شفق', value: 'aurora', background: 'url("/assets/bg-images/aurora (5).jpg")' },
    { label: 'کوه', value: 'mountain', background: 'url("/assets/bg-images/mountain (8).JPG")' },
  ];
  editableUserProfile: User = {
    phoneNumber: '',
    username: '',
    authenticated: false,
    isSubscribed: false,
    minutesListened: 0,
    theme: ''
  }

  constructor(private store: Store<AppState>, private fb: FormBuilder) {

    this.themeName = this.themes.find(theme => theme.value === (this.selectedTheme()))?.label || 'طلوع';

    effect(() => {
      const profileData = this.store.selectSignal(selectUser)
      this.UserProfile.set(profileData())
    })

    effect(() => {
      console.log('selected theme in the profile comp',this.selectedTheme())
      console.log('themeName in the profile comp',this.themeName)
    })

  }


  ngOnInit() {
  }

  updateTheme() {
    if (this.selectedTheme()) {
      this.editableUserProfile= {
        phoneNumber: this.UserProfile() ? this.UserProfile()?.phoneNumber! : '',
        username: this.UserProfile() ? this.UserProfile()?.username : '',
        authenticated: this.UserProfile() ? this.UserProfile()?.authenticated! : false,
        isSubscribed: this.UserProfile() ? this.UserProfile()?.isSubscribed! : false,
        minutesListened: this.UserProfile() ? this.UserProfile()?.minutesListened! : 0,
        theme: this.selectedTheme()!
      }
      console.log('attempting to change the profile data to: ',this.editableUserProfile)
      this.store.dispatch(updateProfile({ user: { ...this.editableUserProfile } }));
    }
  }

  toggleExpanded(panel: 'user' | 'settings' | 'subscription' | 'badges' | 'about') {
    if (this.expanded().includes(panel)) {
      this.expanded.set(this.expanded().filter(p => p !== panel));
    } else {
      this.expanded.set([...this.expanded(), panel]);
      console.log('the session should collapse now')
    }

    this.cutoutService.animateLayoutChanges(500);
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

  openSupport (){
    this.supportService.open()
  }

  logout(event: Event){
    this.confirmationService.confirm({
          target: event.target as EventTarget,
          header:'خروج؟' ,
          message: ' مطمئنی که می خواهی از حساب کاربریت خارج بشی؟',
          rejectLabel: 'نه',
          rejectButtonProps: {
            label: 'به برکه برگرد',
            severity: 'primary',
            outlined: true,
            rounded: true
          },
          acceptButtonProps: {
            label: 'خروج',
            severity: 'danger',
            rounded: true
          },
    
          accept: () => {
    this.store.dispatch(logout());
          },
          reject: () => {
          },
        });
      
    
  }

}
