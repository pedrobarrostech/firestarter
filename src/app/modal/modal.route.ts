
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ModalComponent } from './modal.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'modal', component: ModalComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class ModalRoute { }
