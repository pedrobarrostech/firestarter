import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Client } from '../core/_models/client.model';

@Injectable()
export class ClientService  extends FirestoreService<Client>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'clients');
  }
}
