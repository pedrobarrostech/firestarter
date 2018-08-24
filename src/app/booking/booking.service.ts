import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Booking } from '../core/_models/booking.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BookingService  extends FirestoreService<Booking>  {

  bookingCollection: AngularFirestoreCollection<Booking>;
  bookingDocument: AngularFirestoreDocument<Booking>;

  constructor(public afs: AngularFirestore) {
    super(afs, 'bookings');
  }

  getBookingsByEventId(parentId): Observable<Array<Booking>> {
    this.bookingCollection = this.afs.collection(
      'bookings',
      ref => ref.where('eventId', '==', parentId)
    );

    return this.bookingCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data: any = a.payload.doc.data();

          return {...data, id: a.payload.doc.id};
        });
      })
    );
  }
}
