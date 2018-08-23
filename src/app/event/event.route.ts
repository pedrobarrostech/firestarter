
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventComponent } from './event.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'eventos', component: EventComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class EventRoute { }
