import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { BannerComponent } from './banner.component';
import { BannerRoute } from './banner.route';
import { BannerService } from './banner.service';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NativeDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/native-date-time-adapter.class';
import { DatepickerPtBrConfig } from '../core/_configs/datepicker-pt-br.config';
@NgModule({
  imports: [
    CoreModule,
    BannerRoute,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [BannerComponent],
  providers: [
    BannerService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'pt-br'},
    {provide: DateTimeAdapter, useClass: NativeDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OwlDateTimeIntl, useClass: DatepickerPtBrConfig}
  ]
})
export class BannerModule { }
