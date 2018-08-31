import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { EventComponent } from './event.component';
import { EventRoute } from './event.route';
import { EventService } from './event.service';
import { GalleryModule } from '../gallery/gallery.module';
@NgModule({
  imports: [
    CoreModule,
    EventRoute,
    GalleryModule
  ],
  declarations: [EventComponent],
  providers: [
    EventService
  ]
})
export class EventModule { }
