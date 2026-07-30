import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { BerkeService } from '../shared/services/berke.service';
import { CommonModule } from '@angular/common';
import { Announcement, Order, SubscriptionPlan, User } from '../models/data.models';
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
import { getProfile, logout, setPasswordWithOtpSuccess, updateProfile } from '../state/user/user.actions';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { JalaliDatePipe } from '../shared/pipes/jalali-date.pipe';
import { SupportService } from '../shared/services/support.service';
import { Dialog } from 'primeng/dialog';
import { ManagePasswordComponent } from "../shared/components/manage-password/manage-password.component";
import { ManageThemeComponent } from "../shared/components/manage-theme/manage-theme.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { TableModule } from 'primeng/table';
import { FormatDurationPipe } from '../shared/pipes/format-duration.pipe';
import { requestPasswordOtp } from '../state/otp/otp.actions';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LoadAnnouncements } from '../state/announcement/announcement.actions';
import { selectAnnouncements } from '../state/announcement/announcement.selector';
import { loadOrders } from '../state/order/order.actions';
import { selectOrders } from '../state/order/order.selector';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
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
    ConfirmDialogModule,
    TableModule,
    FormatDurationPipe
  
],
providers:[ConfirmationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private confirmationService= inject(ConfirmationService);
  private supportService = inject(SupportService);
  private berkeService = inject(BerkeService);
  private router = inject(Router)
  private dataService = inject(DataService)
  private store = inject(Store<AppState>);
  expanded = signal<('user' | 'settings' | 'subscription' | 'badges' | 'about' | 'history' | 'announcements')[]>([])
  isEditingUserName = signal<boolean>(false);
  isChangingPassword = signal<boolean>(false);
  isChangingTheme = signal<boolean>(false);
  isChangingNotification = signal<boolean>(false);
  UserProfile = signal<User | null>(null)
  orders = toSignal(this.store.select(selectOrders), {
    initialValue: [] as Order[],
  });  announcements = signal<Announcement[]>([])
  selectedTheme = this.berkeService.userTheme
  subscriptionPlans = this.berkeService.subscriptionPlans
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
    secondsListened: 0,
    theme: '',
    hasPassword: false
  }

  private actions$ = inject(Actions);
  private destroyRef = inject(DestroyRef); // For auto-unsubscribing (Angular 16+)


  constructor() {
    this.store.dispatch(getProfile())
    this.berkeService.loadSubscriptionPlans()
    this.themeName = this.themes.find(theme => theme.value === (this.selectedTheme()))?.label || 'طلوع';
    this.store.dispatch(loadOrders());
    this.store.dispatch(LoadAnnouncements())

    effect(() => {
      const profileData = this.store.selectSignal(selectUser)
      this.UserProfile.set(profileData())
    })

    effect(() => {
      const announcementData = this.store.selectSignal(selectAnnouncements)
      this.announcements.set(announcementData())
    })

    effect(() => {
      if(this.isChangingPassword()){
        this.store.dispatch(requestPasswordOtp())
      } 
    })

    effect(() => {
      console.log('selected theme in the profile comp',this.selectedTheme())
      console.log('themeName in the profile comp',this.themeName)
    })

  }


  ngOnInit() {
      this.actions$.pipe(
      ofType(setPasswordWithOtpSuccess),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.isChangingPassword.set(false)
    });
  }

  updateTheme() {
    if (this.selectedTheme()) {
      this.editableUserProfile= {
        phoneNumber: this.UserProfile() ? this.UserProfile()?.phoneNumber! : '',
        username: this.UserProfile() ? this.UserProfile()?.username : '',
        authenticated: this.UserProfile() ? this.UserProfile()?.authenticated! : false,
        isSubscribed: this.UserProfile() ? this.UserProfile()?.isSubscribed! : false,
        secondsListened: this.UserProfile() ? this.UserProfile()?.secondsListened! : 0,
        theme: this.selectedTheme()!,
        hasPassword: this.UserProfile() ? this.UserProfile()?.hasPassword! : false
      }
      console.log('attempting to change the profile data to: ',this.editableUserProfile)
      this.store.dispatch(updateProfile({ user: { ...this.editableUserProfile } }));
    }
  }

  toggleExpanded(panel: 'user' | 'settings' | 'subscription' | 'badges' | 'about' | 'history' | 'announcements') {
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
      secondsListened: this.UserProfile() ? this.UserProfile()?.secondsListened! : 0,
      theme: this.UserProfile() ? this.UserProfile()?.theme! : '',
      hasPassword: this.UserProfile() ? this.UserProfile()?.hasPassword! : false
    }
    this.isEditingUserName.set(!this.isEditingUserName());

  }

  toSubscribe(plan: SubscriptionPlan){
    this.router.navigate(['/subscribe', plan.id])
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
            severity: 'secondary',
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
