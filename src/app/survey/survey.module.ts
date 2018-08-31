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
    SurveyRoute
  ],
  declarations: [SurveyComponent],
  providers: [
    SurveyService
  ]
})
export class SurveyModule { }
