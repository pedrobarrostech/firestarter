import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { UploadExampleComponent } from './upload-example.component';
import { UploadExampleRoute } from './upload-example.route';
@NgModule({
  imports: [
    CoreModule,
    UploadExampleRoute
  ],
  declarations: [UploadExampleComponent]
})
export class UploadExampleModule { }
