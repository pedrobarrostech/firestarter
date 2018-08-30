import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirestoreService } from './firestore.service';
import { Photo } from '../_models/photo.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AnswerService  extends FirestoreService<Photo>  {

  answerCollection: AngularFirestoreCollection<Photo>;
  photoDocument: AngularFirestoreDocument<Photo>;

  constructor(public afs: AngularFirestore) {
    super(afs, 'answerSurvey');
  }

  getAnswerBySurveyId(surveyId): Observable<Array<Photo>> {
    this.answerCollection = this.afs.collection(
      'answerSurvey',
      ref => ref.where('surveyId', '==', surveyId)
    );

    return this.answerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data: any = a.payload.doc.data();

          return {...data, id: a.payload.doc.id};
        });
      })
    );
  }
}
