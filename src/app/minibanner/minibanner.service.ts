import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Minibanner } from '../core/_models/minibanner.model';

@Injectable()
export class MinibannerService  extends FirestoreService<Minibanner>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'minibanners');
  }
}
