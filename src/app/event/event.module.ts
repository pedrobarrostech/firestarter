import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { EventComponent } from './event.component';
import { EventRoute } from './event.route';
import { EventService } from './event.service';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NativeDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/native-date-time-adapter.class';
import { DatepickerPtBrConfig } from '../core/_configs/datepicker-pt-br.config';
import { GalleryModule } from '../gallery/gallery.module';
@NgModule({
  imports: [
    CoreModule,
    EventRoute,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    GalleryModule
  ],
  declarations: [EventComponent],
  providers: [
    EventService,
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'pt-br'},
    {provide: DateTimeAdapter, useClass: NativeDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OwlDateTimeIntl, useClass: DatepickerPtBrConfig}
  ]
})
export class EventModule { }
