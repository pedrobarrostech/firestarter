import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentReference } from '@firebase/firestore-types';

export abstract class FirestoreService<T> {
  protected collection: AngularFirestoreCollection<T>;
  protected document: AngularFirestoreDocument<T>;

  constructor(protected afs: AngularFirestore, protected type: string) {
    this.collection = this.afs.collection(type);
    this.type = type;
  }

  create(data): Promise<DocumentReference> {
    return this.collection.add(data);
  }

  delete(id: string): Promise<void> {
    return this.get(id).delete();
  }

  get(id: string): AngularFirestoreDocument<T> {
    return this.afs.doc<T>(`${this.type}/${id}`);
  }

  getData(): Observable<Array<T>> {
    // ['added', 'modified', 'removed']
    return this.collection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data: any = a.payload.doc.data();

          return {...data, id: a.payload.doc.id};
        });
      })
    );
  }

  update(id: string, data: any): Promise<void> {
    return this.get(id).update(data);
  }
}
