import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentReference } from '@firebase/firestore-types';

@Injectable()
export class NotesService {

  noteDocument: AngularFirestoreDocument<any>;
  notesCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {
    this.notesCollection = this.afs.collection(
      'notes',
      ref => ref.orderBy('time', 'desc').limit(5)
    );
  }

  createNote(content: string): Promise<DocumentReference> {
    const note = {
      content,
      hearts: 0,
      time: new Date().getTime()
    };

    return this.notesCollection.add(note);
  }

  deleteNote(id: string): Promise<void> {
    return this.getNote(id).delete();
  }

  getData(): Observable<Array<any>> {
    // ['added', 'modified', 'removed']
    return this.notesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data: any = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getNote(id: string): AngularFirestoreDocument<any> {
    return this.afs.doc<any>(`notes/${id}`);
  }

  updateNote(id: string, data: any): Promise<void> {
    return this.getNote(id).update(data);
  }
}
