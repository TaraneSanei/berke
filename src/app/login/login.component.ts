import { Component, computed, effect } from '@angular/core';
import { WindowDirective } from "../directives/window.directive";
import { StepperModule } from 'primeng/stepper';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { login } from '../state/user/user.actions';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { selectAuthenticated, selectUser, selectUserError, selectUserStatus } from '../state/user/user.selector';
import { MessageService } from 'primeng/api';
import { BerkeService } from '../services/berke.service';
import { ToastModule } from 'primeng/toast';
import { selectOtpError, selectOtpStatus, selectOtpTimer } from '../state/otp/otp.selector';
import { requestOtp, verifyOtp } from '../state/otp/otp.actions';
import { PersianDigitsPipe } from '../pipes/persian-digits.pipe'
import { PersianDigitsDirective } from '../directives/persian-digits.directive';

@Component({
  selector: 'app-login',
  imports: [
    WindowDirective,
    PersianDigitsPipe,
    PersianDigitsDirective,
    StepperModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    PasswordModule,
    InputOtpModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  activeStep: number = 1; //stepper 
  direction: 'forward' | 'backward' = 'forward'; //stepper direction
  loginForm: FormGroup;
  user: any;
  authenticated: any;
  errorMessage = computed(() => {
    const userError = this.store.selectSignal(selectUserError)();
    const otpError = this.store.selectSignal(selectOtpError)();
    return otpError || userError || null;
  });
  userStatus: any;
  otpTimer: any;
  otpStatus: any;

  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>, private berkeService: BerkeService, private messageService: MessageService) {
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required,
      (control: AbstractControl) => {
        if (!control.value) return null;
        const normalized = this.berkeService.toEnglishDigits(control.value);
        const valid = /^09\d{9}$/.test(normalized); // only digits
        return valid ? null : { invalidPhone: true };
      }]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      otp: [{ value: '', disabled: true }, [Validators.required,
      (control: AbstractControl) => {
        if (!control.value) return null;
        const normalized = this.berkeService.toEnglishDigits(control.value);
        const valid = /^\d{6}$/.test(normalized); // only digits
        return valid ? null : { invalidOtp: true };
      }
      ]]
    });

    this.user = this.store.selectSignal(selectUser);
    this.authenticated = this.store.selectSignal(selectAuthenticated);
    this.userStatus = this.store.selectSignal(selectUserStatus);
    this.otpTimer = this.store.selectSignal(selectOtpTimer);
    this.otpStatus = this.store.selectSignal(selectOtpStatus);

    effect(() => {
      if (this.otpStatus() === 'sent') {
        this.showOtpMessage()
      }
    })

    effect(() => {
      if (this.userStatus() === 'success') {
        if (this.authenticated() === false) {
          this.goToStep(3);
          this.loginForm.get('otp')?.enable();
          this.sendOtp();
        } else {
          this.goToStep(4);
        }
      }
    })

    this.setupErrorToast()

  }

  //form control getters
  get phoneNumber(): FormControl {
    return this.loginForm.get('phoneNumber') as FormControl
  }

  get otp(): FormControl {
    return this.loginForm.get('otp') as FormControl
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl
  }

  goToStep(step: number) {
    if (step === this.activeStep) return;
    this.direction = step > this.activeStep ? 'forward' : 'backward';
    this.activeStep = step;
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  login() {
    if (this.loginForm.valid) {
      const normalizedPhone = this.berkeService.toEnglishDigits(this.phoneNumber.value);
      const password = this.password.value;
      this.store.dispatch(login({ phoneNumber: normalizedPhone, password }));
    }
  }


  sendOtp() {
    this.store.dispatch(requestOtp())
  }

  showOtpMessage() {
    this.messageService.add({ severity: 'info', summary: 'لطفاً شماره تماس خود را تایید کنید.', detail: 'کد تایید به شماره تماس شما ارسال شد. ', life: 3000 });
  }

  verifyOTP() {
    const otp = this.loginForm.get('otp')?.value;
    const normalizedOtp = this.berkeService.toEnglishDigits(otp);
    this.store.dispatch(verifyOtp({ otp: Number(normalizedOtp) }));
  }

  //helper functions to show persian numerals
  private toPersian = (s: string) => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);

  normalizeDigits(value: string) {
    const persian = this.toPersian(value);
    this.otp.setValue(persian, { emitEvent: false });
    console.log(this.otp.value)
  }

    private setupErrorToast() {
    effect(() => {
      const error = this.errorMessage();
      if (error) {
        this.messageService.add({
          severity: 'info',
          summary: 'خطا',
          detail: this.berkeService.getErrorMessage(error),
          life: 3000
        });
      }
    });
  }

    onStart() {
    this.router.navigate(['']);
  }
}