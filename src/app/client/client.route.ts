
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'whatsapp', component: ClientComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class ClientRoute { }
