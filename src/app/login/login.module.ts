import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRoute } from './login.route';

@NgModule({
  imports: [
    CoreModule,
    LoginRoute
  ],
  declarations: [LoginComponent, LoginFormComponent]
})

export class LoginModule { }
