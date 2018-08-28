import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Question } from '../core/_models/question.model';

@Injectable()
export class QuestionService  extends FirestoreService<Question>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'questions');
  }
}
