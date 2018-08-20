
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UploadExampleComponent } from './upload-example.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'uploads', component: UploadExampleComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class UploadExampleRoute { }
