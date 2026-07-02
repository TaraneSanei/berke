import { Component, inject, signal } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { FloatLabelModule } from 'primeng/floatlabel';
import { requestPasswordOtp } from '../../../state/otp/otp.actions';
import { setPasswordWithOtp } from '../../../state/user/user.actions';
import { BerkeService } from '../../services/berke.service';
import { selectOtpStatus, selectOtpTimer } from '../../../state/otp/otp.selector';
import { PersianDigitsPipe } from '../../pipes/persian-digits.pipe';


@Component({
  selector: 'app-manage-password',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    PasswordModule,
    InputOtpModule,
    FloatLabelModule,
    PersianDigitsPipe
  ],
  templateUrl: './manage-password.component.html',
  styleUrl: './manage-password.component.css'
})
export class ManagePasswordComponent {

  changePasswordForm: FormGroup;
  private store = inject(Store<AppState>);
  private fb = inject(FormBuilder);
  private berkeService = inject(BerkeService)
  passwordRepeatFocused = signal<boolean>(false);
  otpInput = signal<boolean>(false);
  otpTimer: any;
  otpStatus: any;

  constructor() {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      repeatNewPassword: ['', Validators.required],
      otp: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator()
    });

    this.otpTimer = this.store.selectSignal(selectOtpTimer);
    this.otpStatus = this.store.selectSignal(selectOtpStatus);
  }

  get newPassword() { return this.changePasswordForm.get('newPassword')?.value; }
  get repeatNewPassword() { return this.changePasswordForm.get('repeatNewPassword')?.value; }
  get otpControl() { return this.changePasswordForm.get('otp'); }

  // --- Validators ---
  passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get('newPassword')?.value;
      const repeatPassword = form.get('repeatNewPassword')?.value;
      if (!password || !repeatPassword) return null;
      return password === repeatPassword ? null : { passwordMismatch: true };
    };
  }

  requestOtp(){
    this.store.dispatch(requestPasswordOtp())
  }
  
  submit() {
    if (this.changePasswordForm.invalid) return;
    const otp = this.changePasswordForm.get('otp')?.value;
    const normalizedOtp = this.berkeService.toEnglishDigits(otp);
      this.store.dispatch(setPasswordWithOtp({ 
        otp: normalizedOtp,
        newPassword: this.newPassword
      }));
    console.log('Dispatching OTP Reset:', { otp, newPassword: this.newPassword });
    this.changePasswordForm.reset();
  }

  // --- Helpers ---
  private toPersian = (s: string) => s.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);

  normalizeDigits(event: any) {
    const value = typeof event === 'string' ? event : event.value || '';
    const persian = this.toPersian(value);
    this.otpControl?.setValue(persian, { emitEvent: false });
  }
}