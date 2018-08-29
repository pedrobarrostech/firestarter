import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SurveyComponent } from './survey.component';
import { SurveyRoute } from './survey.route';
import { SurveyService } from './survey.service';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NativeDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/native-date-time-adapter.class';
import { DatepickerPtBrConfig } from '../core/_configs/datepicker-pt-br.config';

@NgModule({
  imports: [
    CoreModule,
    SurveyRoute,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  declarations: [SurveyComponent],
  providers: [
    SurveyService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'pt-br'},
    {provide: DateTimeAdapter, useClass: NativeDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OwlDateTimeIntl, useClass: DatepickerPtBrConfig}
  ]
})
export class SurveyModule { }
