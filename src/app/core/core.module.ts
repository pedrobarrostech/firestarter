import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { CommonModule } from '@angular/common';
import { NgxTrumbowygModule } from 'ngx-trumbowyg';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NativeDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/native-date-time-adapter.class';
import { GoogleChartsModule } from 'angular-google-charts';

import { DatepickerPtBrConfig } from './_configs/datepicker-pt-br.config';
import { UploadService } from './_services/upload.service';
import { AuthGuard } from './_guards/auth.guard';
import { AuthService } from './_services/auth.service';
import { NotifyService } from './_services/notify.service';
import { ScrollService } from './_services/scroll.service';
import { AnswerService } from './_services/answer.service';
import { DropZoneDirective } from './upload/drop-zone.directive';
import { FileSizePipe } from './upload/file-size.pipe';

const MODULES = [
  CommonModule,
  HttpClientModule,
  RouterModule,
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  BrowserAnimationsModule,
  DataTablesModule,
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  NgxTrumbowygModule,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  GoogleChartsModule
];

const PIPES = [
  FileSizePipe
];

const COMPONENTS = [
  // put shared components here
];

const DIRECTIVES = [
  DropZoneDirective
];

const SERVICES = [
  AuthGuard,
  AuthService,
  UploadService,
  NotifyService,
  ScrollService,
  AnswerService,
  {provide: OWL_DATE_TIME_LOCALE, useValue: 'pt-br'},
  {provide: DateTimeAdapter, useClass: NativeDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
  {provide: OwlDateTimeIntl, useClass: DatepickerPtBrConfig}
];

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
    ...PIPES,
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  providers: [
    ...SERVICES
  ],
  exports: [
    ...MODULES,
    ...PIPES,
    ...COMPONENTS
  ]
})
export class CoreModule { }
