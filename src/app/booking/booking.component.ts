import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { Booking } from '../core/_models/booking.model';
import { routerTransition } from '../core/_configs/router-transition.config';
import { ScrollService } from '../core/_services/scroll.service';
import { BookingService } from './booking.service';
import { EventService } from '../event/event.service';
@Component({
  animations: [ routerTransition() ],
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class BookingComponent implements OnInit, OnDestroy, AfterViewInit {
  addBookingForm: FormGroup;
  bannerEditImage = {};
  booking = {};
  bookings: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  event = new Booking();
  id: string;
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;
  sub: any;

  private email = new FormControl('', Validators.required);
  private eventId = new FormControl('', Validators.required);
  private infoMsg = { body: '', type: 'info'};
  private name = new FormControl('', Validators.required);
  private phone = new FormControl('', Validators.required);

  constructor(
    private _scrollService: ScrollService,
    private _bookingService: BookingService,
    private _eventService: EventService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  addBooking(): void {
    window.setTimeout(() => {
      this._bookingService.create(this.addBookingForm.value).then(
        () => {
          this.addBookingForm.reset();
          this.rerender();
          this.scrollTo('table');
        },
        error => console.error(error)
      );
    }, 1000);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.booking = {};
    this.sendInfoMsg('Edição de reserva cancelada.', 'warning');
  }

  deleteBooking(booking): void {
    if (window.confirm('Tem certeza que quer deletar esta reserva?')) {
      this._bookingService.delete(booking.id).then(
        () => {
          this.sendInfoMsg('Reserva deletado com sucesso.', 'success');
          this.bookings = this._bookingService.getBookingsByEventId(this.id);
          this.rerender();
        },
        error => console.error(error)
      );
    }
  }

  editBooking(booking): void {

    this._bookingService.update(booking.id, booking).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('Reserva editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(booking): void {
    this.isEditing = true;
    this.booking = booking;
  }

  getBookings(eventId): void {
    this._bookingService.getBookingsByEventId(eventId).subscribe(
      data => {
        this.bookings = data;
        this.rerender();
      },
      error => console.error(error),
      () => this.isLoading = false
    );
  }

  getEvent(id): void {
    this._eventService.getById(id).then(
      data => {
        this.event = data;
        this.addBookingForm.get('eventId').setValue(this.id);
        this.rerender();
      },
      error => console.error(error)
    );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getBookings(this.id);
      this.getEvent(this.id);
    });

    this.dtOptions = DATATABLES_CONFIG;
    this.addBookingForm = this.formBuilder.group({
      name: this.name,
      phone: this.phone,
      email: this.email,
      eventId: this.eventId
    });
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then(
        (dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        },
        error => console.error(error)
      );
    }
  }

  scrollTo(id): any {
    this._scrollService.scrollTo(id);
  }

  sendInfoMsg(body, type, time = 3000): void {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }
}
