import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { GalleryComponent } from './gallery.component';
import { GalleryService } from './gallery.service';

@NgModule({
  imports: [
    CoreModule
  ],
  declarations: [GalleryComponent],
  providers: [
    GalleryService
  ],
  exports: [GalleryComponent]
})
export class GalleryModule { }
