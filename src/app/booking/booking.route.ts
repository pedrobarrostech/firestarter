
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BookingComponent } from './booking.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'reservas/:id', component: BookingComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class BookingRoute { }
