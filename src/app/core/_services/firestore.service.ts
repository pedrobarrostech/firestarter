import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export abstract class FirestoreService<T> {
  collection: AngularFirestoreCollection<T>;
  document:   AngularFirestoreDocument<T>;

  constructor(protected afs: AngularFirestore, protected type: string) {
    this.collection = this.afs.collection(type);
    this.type = type;
  }

  getData(): Observable<T[]> {
    // ['added', 'modified', 'removed']
    return this.collection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return Object.assign(data, { id: a.payload.doc.id});
        });
      })
    );
  }

  get(id: string) {
    return this.afs.doc<T>(`${this.type}/${id}`);
  }

  create(data) {
    return this.collection.add(data);
  }

  update(id: string, data: any) {
    return this.get(id).update(data);
  }

  delete(id: string) {
    return this.get(id).delete();
  }
}
