import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { ModalComponent } from './modal.component';
import { ModalRoute } from './modal.route';
import { ModalService } from './modal.service';
import { GalleryModule } from '../gallery/gallery.module';

@NgModule({
  imports: [
    CoreModule,
    GalleryModule,
    ModalRoute
  ],
  declarations: [ModalComponent],
  providers: [ModalService]
})
export class ModalModule { }
