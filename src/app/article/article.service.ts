import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { FirestoreService } from '../core/_services/firestore.service';
import { Article } from '../core/_models/article.model';

@Injectable()
export class ArticleService  extends FirestoreService<Article>  {

  constructor(public afs: AngularFirestore) {
    super(afs, 'articles');
  }
}
