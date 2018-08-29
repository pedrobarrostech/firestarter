import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Survey } from '../core/_models/survey.model';

@Injectable()
export class SurveyService  extends FirestoreService<Survey>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'surveys');
  }
}
