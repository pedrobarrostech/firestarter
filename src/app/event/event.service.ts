import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Event } from '../core/_models/event.model';

@Injectable()
export class EventService  extends FirestoreService<Event>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'events');
  }
}
