
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BannerComponent } from './banner.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'banners', component: BannerComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class BannerRoute { }
