import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { MinibannerComponent } from './minibanner.component';
import { MinibannerRoute } from './minibanner.route';
import { MinibannerService } from './minibanner.service';
@NgModule({
  imports: [
    CoreModule,
    MinibannerRoute
  ],
  declarations: [MinibannerComponent],
  providers: [MinibannerService]
})
export class MinibannerModule { }
