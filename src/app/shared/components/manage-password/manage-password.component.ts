import { Component, inject, Input, signal } from '@angular/core';
import { FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { changePassword } from '../../../state/user/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-manage-password',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    PasswordModule
  ],
  templateUrl: './manage-password.component.html',
  styleUrl: './manage-password.component.css'
})
export class ManagePasswordComponent {
  @Input() mode: 'change' | 'reset' | 'forgot' = 'change';

  changePasswordForm: FormGroup;
  private store = inject(Store<AppState>);
  private fb = inject(FormBuilder);
  passwordRepeatFocused = signal<boolean>(false);

  constructor() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatNewPassword: ['', Validators.required]
      ,
    }, {
      validators: this.passwordMatchValidator()
    });
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

  changePassword() {
    this.store.dispatch(changePassword({ oldPassword: this.oldPassword, newPassword: this.newPassword }));
    this.changePasswordForm.reset();
  }
}
