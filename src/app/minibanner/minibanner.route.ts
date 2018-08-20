
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MinibannerComponent } from './minibanner.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'minibanners', component: MinibannerComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class MinibannerRoute { }
