import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import * as firebase from 'firebase';

import { Photo } from '../core/_models/photo.model';
import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { GalleryService } from './gallery.service';
import { UploadService } from '../core/_services/upload.service';
import { ScrollService } from '../core/_services/scroll.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy, AfterViewInit {
  addPhotoForm: FormGroup;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  gallery: any = [];
  galleryEditImage = {};
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;
  // tslint:disable-next-line:no-input-rename
  @Input('parentId')
  parentId: string;
  photo = new Photo();

  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info' };
  private link = new FormControl('', Validators.required);
  private name = new FormControl('', Validators.required);
  private order = new FormControl('', Validators.required);

  constructor(
    private _scrollService: ScrollService,
    private _galleryService: GalleryService,
    private formBuilder: FormBuilder) {
  }

  addPhoto(): void {
    window.setTimeout(() => {
      this.addPhotoForm.get('parentId').setValue(this.parentId);
      this._galleryService.create(this.addPhotoForm.value).then(
        () => {
          this.addPhotoForm.reset();
          this.rerender();
          this.scrollTo('table');
        },
        error => console.error(error)
      );
    }, 1000);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.photo = {};
    this.sendInfoMsg('Edição de foto cancelada.', 'warning');
  }

  deletePhoto(photo): void {
    if (window.confirm('Tem certeza que quer deletar este photo?')) {
      this._galleryService.delete(photo.id).then(
        () => {
          UploadService.deleteFile(photo.imageRef).then(
            () => {
              this.sendInfoMsg('Foto apagada com sucesso.', 'success');
              this.getGallery();
              this.rerender();
            },
            error => console.error(error)
          );
        },
        error => console.error(error)
      );
    }
  }

  editPhoto(photo): void {
    if (this.imageEdit) {
      photo.image = this.imageEdit;
      photo.imageRef = this.imageEditRef;
    }

    this._galleryService.update(photo.id, photo).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('Foto editada com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(photo): void {
    this.isEditing = true;
    this.photo = photo;

  }

  getGallery(): void {
    this._galleryService.getGalleryByParentId(this.parentId).subscribe(
      data => {
        this.gallery = data;
        this.rerender();
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
    this.getGallery();
    this.addPhotoForm = this.formBuilder.group({
      name: this.name,
      link: this.link,
      order: this.order,
      image: null,
      imageRef: null,
      parentId: null
    });
  }

  async onFileChange(event): Promise<void> {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      const file = event.target.files[0];
      this.imageUploadStatus = false;
      reader.readAsDataURL(file);
      reader.onload = () => {

        const filename = `${UploadService.generateId()}${file.name}`;
        const ref = firebase.storage().ref();
        const storageRef = ref.child(filename);
        storageRef.put(file).then(
          snapshot => {
            snapshot.ref.getDownloadURL().then(
              downloadURL => {
                this.addPhotoForm.get('image').setValue(downloadURL);
                this.addPhotoForm.get('imageRef').setValue(filename);
                this.imageEdit = downloadURL;
                this.imageEditRef = filename;
                this.imageUploadStatus = true;
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

  scrollTo(id): any {
    this._scrollService.scrollTo(id);
  }

  sendInfoMsg(body, type, time = 3000): void {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }

}
