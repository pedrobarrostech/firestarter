import { Component, ViewEncapsulation } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask
} from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'upload-example',
  templateUrl: './upload-example.component.html',
  styleUrls: ['./upload-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UploadExampleComponent {

  // Download URL
  downloadURL: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;
  // Main task
  task: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  // Determines if the upload task is active
  isActive(snapshot): any {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  startUpload(event: FileList): any {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');

      return;
    }

    // The storage path
    const path = `test/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      tap(snap => {
        if (snap.bytesTransferred === snap.totalBytes) {
          // Update firestore on completion
          this.db.collection('photos').add({ path, size: snap.totalBytes })
            .then(
              () => console.warn('Upload success!'),
              error => console.error(error)
            );
        }
      }),
      finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL())
    );
    // The file's download URL
  }

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }
}
