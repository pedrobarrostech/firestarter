
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { QuestionComponent } from './question.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'questoes', component: QuestionComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class QuestionRoute { }
