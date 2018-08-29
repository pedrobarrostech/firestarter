import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../core/_services/auth.service';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginFormComponent implements OnInit {

  formErrors: FormErrors = {
    email: '',
    password: ''
  };
  newUser = false; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
  userForm: FormGroup;
  validationMessages = {
    email: {
      required: 'E-mail é obrigatório.',
      email: 'E-mail precisa ser válido.'
    },
    password: {
      required: 'Senha é obrigatório.',
      pattern: 'A senha deve conter letras e números.',
      minlength: 'A senha deve ter pelo menos 4 caracteres.',
      maxlength: 'A senha não pode ter mais de 40 caracteres.'
    }
  };

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  buildForm(): void {
    this.userForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  login(): void {
    this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password'])
      .then(
        () => console.warn('Login success!'),
        error => console.error(error)
      );
  }

  ngOnInit(): void {
    this.buildForm();
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any): void {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${(messages as {[key: string]: string})[key]} `;
              }
            }
          }
        }
      }
    }
  }

  resetPassword(): void {
    this.auth.resetPassword(this.userForm.value['email'])
      .then(
        () => this.passReset = true,
        error => console.error(error)
      );
  }

  signup(): void {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
      .then(
        () => console.warn('Login success!'),
        error => console.error(error)
      );
  }

  toggleForm(): void {
    this.newUser = !this.newUser;
  }
}
