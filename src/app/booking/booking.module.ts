import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { BookingComponent } from './booking.component';
import { BookingRoute } from './booking.route';
import { BookingService } from './booking.service';
@NgModule({
  imports: [
    CoreModule,
    BookingRoute
  ],
  declarations: [BookingComponent],
  providers: [BookingService]
})
export class BookingModule { }
