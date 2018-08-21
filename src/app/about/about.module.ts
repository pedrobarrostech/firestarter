import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { AboutComponent } from './about.component';
import { AboutRoute } from './about.route';
import { AboutService } from './about.service';
import { GalleryModule } from '../gallery/gallery.module';

@NgModule({
  imports: [
    CoreModule,
    GalleryModule,
    AboutRoute
  ],
  declarations: [AboutComponent],
  providers: [AboutService]
})
export class AboutModule { }
