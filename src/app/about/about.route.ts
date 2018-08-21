
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'sobre', component: AboutComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class AboutRoute { }
