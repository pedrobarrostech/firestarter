import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Modal } from '../core/_models/modal.model';

@Injectable()
export class ModalService  extends FirestoreService<Modal>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'modal');
  }
}
