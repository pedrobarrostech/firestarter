import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Photo } from '../core/_models/photo.model';

@Injectable()
export class GalleryService  extends FirestoreService<Photo>  {

  galleryCollection: AngularFirestoreCollection<Photo>;
  photoDocument: AngularFirestoreDocument<Photo>;

  constructor(public afs: AngularFirestore) {
    super(afs, 'photos');
  }

  getGalleryByParentId(parentId): AngularFirestoreCollection<Photo> {
    return this.galleryCollection = this.afs.collection(
      'photos',
      ref => ref.where('parentId', '==', parentId)
    );
  }
}
