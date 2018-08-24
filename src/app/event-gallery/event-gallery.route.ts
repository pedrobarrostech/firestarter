
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventGalleryComponent } from './event-gallery.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'galerias/:id', component: EventGalleryComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class EventGalleryRoute { }
