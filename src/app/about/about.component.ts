import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AboutService } from './about.service';
import { UploadService } from '../core/_services/upload.service';
import { About } from '../core/_models/about.model';
import { Subject } from 'rxjs';
import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import * as firebase from 'firebase';
import { DataTableDirective } from 'angular-datatables';
import { routerTransition } from '../core/_configs/router-transition.config';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AboutComponent implements OnInit, OnDestroy, AfterViewInit {
  about = new About();
  aboutEditImage = {};
  description = new FormControl('', Validators.required);
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  editAboutForm: FormGroup;
  hashtagInstagram = new FormControl('', Validators.required);
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;
  name = new FormControl('', Validators.required);
  playlist = new FormControl('', Validators.required);
  video = new FormControl('', Validators.required);

  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info' };

  constructor(private _aboutService: AboutService, private formBuilder: FormBuilder) { }

  cancelEditing(): void {
    this.isEditing = false;
    this.about = {};
    this.sendInfoMsg('Edição de about cancelada.', 'warning');
  }

  editAbout(about): void {
    if (this.imageEdit) {
      about.image = this.imageEdit;
      about.imageRef = this.imageEditRef;
    }

    this._aboutService.update(about.id, about).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('About editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(about): void {
    this.isEditing = true;
    this.about = about;

  }

  getAboutInfo(): void {
    this._aboutService.getData().subscribe(
      data => {
        this.about = data[0];
      },
      error => console.error(error),
      () => this.isLoading = false
    );
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.dtOptions = DATATABLES_CONFIG;
    this.getAboutInfo();
    this.editAboutForm = this.formBuilder.group({
      name: this.name,
      playlist: this.playlist,
      hashtagInstagram: this.hashtagInstagram,
      description: this.description,
      video: this.video,
      image: null,
      imageRef: null
    });
  }

  async onFileChange(event): Promise<void> {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {

        const filename = `${UploadService.generateId()}${file.name}`;
        const ref = firebase.storage().ref();
        const storageRef = ref.child(filename);
        storageRef.put(file).then(
          snapshot => {
            snapshot.ref.getDownloadURL().then(
              downloadURL => {
                this.editAboutForm.get('image').setValue(downloadURL);
                this.editAboutForm.get('imageRef').setValue(filename);
                this.imageEdit = downloadURL;
                this.imageEditRef = filename;
              },
              error => console.error(error));
          },
          error => console.error(error)
        );
      };
    }
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then(
        (dtInstance: DataTables.Api) => {
            // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        },
        error => console.error(error)
      );
    }
  }

  sendInfoMsg(body, type, time = 3000): void {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }

}
