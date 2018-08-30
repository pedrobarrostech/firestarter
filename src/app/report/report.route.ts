
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ReportComponent } from './report.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'relatorios', component: ReportComponent, canActivate: [AuthGuard] },
      { path: 'relatorios/:id', component: ReportDetailComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class ReportRoute { }
