import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { About } from '../core/_models/about.model';

@Injectable()
export class AboutService  extends FirestoreService<About>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'about');
  }
}
