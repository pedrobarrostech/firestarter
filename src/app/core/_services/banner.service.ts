import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from './firestore.service';
import { Minibanner } from '../_models/minibanner.model';

@Injectable()
export class BannerService  extends FirestoreService<Minibanner>  {

  constructor (public afs: AngularFirestore) {
    super(afs, `banners`);
  }
}
