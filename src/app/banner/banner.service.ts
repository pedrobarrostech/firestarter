import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BannerService {

  bannerCollection: AngularFirestoreCollection<any>;
  bannerDocument:   AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore) {
    this.bannerCollection = this.afs.collection('banners');
  }

  getData(): Observable<any[]> {
    // ['added', 'modified', 'removed']
    return this.bannerCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();

          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  get(id: string) {
    return this.afs.doc<any>(`banners/${id}`);
  }

  create(data) {
    return this.bannerCollection.add(data);
  }

  update(id: string, data: any) {
    return this.get(id).update(data);
  }

  delete(id: string) {
    return this.get(id).delete();
  }
}
