import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { BerkeService } from '../shared/services/berke.service';
import { ToastModule } from 'primeng/toast';
import { selectOtpError, selectOtpStatus, selectOtpTimer, selectUserExists } from '../state/otp/otp.selector';
import { requestOtp, verifyOtp } from '../state/otp/otp.actions';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe'
import { PersianDigitsDirective } from '../shared/directives/persian-digits.directive';
import { SupportService } from '../shared/services/support.service';

@Component({
  selector: 'app-login',
  imports: [
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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  forgotPassword = signal<boolean>(false);
  activeStep: number = 1; //stepper 
  direction: 'forward' | 'backward' = 'forward'; //stepper direction
  loginForm: FormGroup;
  user: any;
  authenticated: any;
  loginMethod = signal<"password" | "otp"> ("otp")
  private supportService = inject(SupportService)
  errorMessage = computed(() => {
    const userError = this.store.selectSignal(selectUserError)();
    const otpError = this.store.selectSignal(selectOtpError)();
    return otpError || userError || null;
  });
  userStatus: any;
  otpTimer: any;
  otpStatus: any;
  userExists: any;
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
      otp: ['', [Validators.required,]]
    });

    this.user = this.store.selectSignal(selectUser);
    this.userStatus = this.store.selectSignal(selectUserStatus);
    this.otpTimer = this.store.selectSignal(selectOtpTimer);
    this.otpStatus = this.store.selectSignal(selectOtpStatus);
    this.userExists = this.store.selectSignal(selectUserExists);
    
    effect(() => {
      if (this.otpStatus() === 'sent') {
        this.showOtpMessage()
      }
    })

    effect(() => {
      if (this.userStatus() === 'success') {
          this.goToStep(3);
      }
    })

    effect(() => {
      if (this.loginMethod() === "password"){
        this.loginForm.get('password')?.enable()
        this.loginForm.get('otp')?.disable()
      }
      else {
        this.loginForm.get('password')?.disable()
        this.loginForm.get('otp')?.enable()
      }
    })
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


  login() {
    if (this.loginForm.valid) {
      const normalizedPhone = this.berkeService.toEnglishDigits(this.phoneNumber.value);
      const password = this.password.value;
      this.store.dispatch(login({ phoneNumber: normalizedPhone, password }));
    }
  }


  sendOtp() {
    const normalizedPhone = this.berkeService.toEnglishDigits(this.phoneNumber.value).toString()
    this.store.dispatch(requestOtp({phoneNumber: normalizedPhone}))
  }

  showOtpMessage() {
    this.messageService.add({ severity: 'info', summary: 'لطفاً شماره تماس خود را تایید کنید.', detail: 'کد تایید به شماره تماس شما ارسال شد. ', life: 3000 });
  }

  verifyOTP() {
    const otp = this.loginForm.get('otp')?.value;
    console.log("otp value", otp)
    const normalizedOtp = this.berkeService.toEnglishDigits(otp);
    console.log("normalized otp", normalizedOtp)

    const normalizedPhone = this.berkeService.toEnglishDigits(this.phoneNumber.value).toString()
    this.store.dispatch(verifyOtp({phoneNumber: normalizedPhone,  otp: normalizedOtp }));
  }

  //helper functions to show persian numerals
  private toPersian = (s: string) => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);

  normalizeDigits(value: string) {
    const persian = this.toPersian(value);
    this.otp.setValue(persian, { emitEvent: false });
    console.log(this.otp.value)
  }



    onStart() {
    if(this.userExists()){
    this.router.navigate(['berke']);
      } else {
      this.router.navigate(['preferences']);
      }
  }

  resolveLogin() {
    if (this.loginMethod() === 'password'){
      this.login()
    } else {
      this.verifyOTP()
    }
}
  
  openSupport (){
    this.supportService.open()
  }
}