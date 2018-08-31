import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { ReportComponent } from './report.component';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { ReportRoute } from './report.route';

@NgModule({
  imports: [
    CoreModule,
    ReportRoute
  ],
  declarations: [
    ReportComponent,
    ReportDetailComponent
  ]
})
export class ReportModule { }
