import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { EventGalleryComponent } from './event-gallery.component';
import { EventGalleryRoute } from './event-gallery.route';
import { GalleryModule } from '../gallery/gallery.module';

@NgModule({
  imports: [
    CoreModule,
    GalleryModule,
    EventGalleryRoute
  ],
  declarations: [EventGalleryComponent]
})
export class EventGalleryModule { }
