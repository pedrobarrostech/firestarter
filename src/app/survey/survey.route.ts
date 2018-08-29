
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SurveyComponent } from './survey.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'enquetes', component: SurveyComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class SurveyRoute { }
