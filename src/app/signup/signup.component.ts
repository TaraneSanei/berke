import { Component, computed, effect, inject } from '@angular/core';
import { WindowDirective } from '../shared/directives/window.directive';
import { StepperModule } from 'primeng/stepper';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { BerkeService } from '../shared/services/berke.service';
import { MessageService } from 'primeng/api';
import { signup } from '../state/user/user.actions';
import { requestOtp, verifyOtp } from '../state/otp/otp.actions';
import { selectOtpError, selectOtpStatus, selectOtpTimer } from '../state/otp/otp.selector';
import { selectAuthenticated, selectUserError, selectUserStatus } from '../state/user/user.selector';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { PersianDigitsDirective } from '../shared/directives/persian-digits.directive';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';
import { SupportService } from '../shared/services/support.service';

@Component({
  selector: 'app-signup',
  imports: [
    WindowDirective,
    PersianDigitsDirective,
    PersianDigitsPipe,
    StepperModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    FloatLabelModule,
    InputNumberModule,
    InputTextModule,
    PasswordModule,
    InputOtpModule,
    ToastModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  private supportService = inject(SupportService)
  activeStep: number = 1; //stepper 
  direction: 'forward' | 'backward' = 'forward'; //stepper direction
  signupForm: FormGroup;
  errorMessage = computed(() => {
    const userError = this.store.selectSignal(selectUserError)();
    const otpError = this.store.selectSignal(selectOtpError)();
    return otpError || userError || null;
  });
  passwordRepeatFocused = false;
  userStatus: any;
  otpTimer: any;
  otpStatus: any;
  authenticated: any;


  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>, private berkeService: BerkeService, private messageService: MessageService) {
    this.signupForm = this.fb.group({
      phoneNumber: ['', [Validators.required,
      (control: AbstractControl) => {
        if (!control.value) return null;
        const normalized = this.berkeService.toEnglishDigits(control.value);
        const valid = /^09\d{9}$/.test(normalized); // only digits
        return valid ? null : { invalidPhone: true };
      }]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', [Validators.required]],
      otp: [{ value: '', disabled: true }, [Validators.required,
      //I turned this validator into a validator function. delete this part to see if the function works
      (control: AbstractControl) => {
        if (!control.value) return null;
        const normalized = this.berkeService.toEnglishDigits(control.value);
        const valid = /^\d{6}$/.test(normalized); // only digits
        return valid ? null : { invalidOtp: true };
      }
      ]]
    }, {
      validators: this.passwordMatchValidator()
    });

    this.authenticated = this.store.selectSignal(selectAuthenticated);
    this.userStatus = this.store.selectSignal(selectUserStatus);
    this.otpTimer = this.store.selectSignal(selectOtpTimer);
    this.otpStatus = this.store.selectSignal(selectOtpStatus);

    effect(() => {
      if (this.userStatus() === 'success') {
        if (this.authenticated() === false) {
          this.goToStep(3);
          this.signupForm.get('otp')?.enable();
          this.sendOtp();
        }
      }
    }
    )

    effect(() => {
      if (this.otpStatus() === 'verified') {
        this.goToStep(4);
      }
    }
    )

    this.setupErrorToast()

  }

  //form control getters
  get phoneNumber(): FormControl {
    return this.signupForm.get('phoneNumber') as FormControl
  }

  get otp(): FormControl {
    return this.signupForm.get('otp') as FormControl
  }

  get password(): FormControl {
    return this.signupForm.get('password') as FormControl
  }

  get passwordRepeat(): FormControl {
    return this.signupForm.get('passwordRepeat') as FormControl
  }

  goToStep(step: number) {
    if (step === this.activeStep) return;
    this.direction = step > this.activeStep ? 'forward' : 'backward';
    this.activeStep = step;
  }

  onLogin() {
    this.router.navigate(['/login'])
  }

  onStart() {
      this.router.navigate(['/preferences'])

}

  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('password')?.value;
      const repeatPassword = form.get('passwordRepeat')?.value;

      return password === repeatPassword ? null : { passwordMismatch: true };
    };
  }

  otpLengthValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      const otp = this.otp.value
      if (!otp) return null;
      const normalized = this.berkeService.toEnglishDigits(otp);
      const valid = /^\d{6}$/.test(normalized); // only digits
      return valid ? null : { invalidOtp: true };
    };
  }

  signup() {
    if (this.signupForm.valid) {
      const normalizedPhone = this.berkeService.toEnglishDigits(this.phoneNumber.value);
      const password = this.password.value;
      this.store.dispatch(signup({ phoneNumber: normalizedPhone, password }));
    }
  }

  sendOtp() {
    this.store.dispatch(requestOtp())
  }

  showOtpMessage() {
    this.messageService.add({ severity: 'info', summary: 'لطفاً شماره تماس خود را تایید کنید.', detail: 'کد تایید به شماره تماس شما ارسال شد. ', life: 3000 });
  }

  verifyOTP() {
    const otp = this.signupForm.get('otp')?.value;
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


  onPasswordRepeatFocus() {
    this.passwordRepeatFocused = true;
  }

  onPasswordRepeatBlur() {
    this.passwordRepeatFocused = false;
  }

    openSupport (){
    this.supportService.open()
  }

}
