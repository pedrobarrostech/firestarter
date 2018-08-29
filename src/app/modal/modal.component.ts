import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from './modal.service';
import { UploadService } from '../core/_services/upload.service';
import { Modal } from '../core/_models/modal.model';
import { Subject } from 'rxjs';
import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import * as firebase from 'firebase';
import { DataTableDirective } from 'angular-datatables';
import { routerTransition } from '../core/_configs/router-transition.config';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {
  active = new FormControl('', Validators.required);
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  editModalForm: FormGroup;
  hashtagInstagram = new FormControl('', Validators.required);
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;
  modal = new Modal();
  modalEditImage = {};
  name = new FormControl('', Validators.required);

  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info' };

  constructor(private _modalService: ModalService, private formBuilder: FormBuilder) { }

  cancelEditing(): void {
    this.isEditing = false;
    this.modal = {};
    this.sendInfoMsg('Edição de modal cancelada.', 'warning');
  }

  editModal(modal): void {
    if (this.imageEdit) {
      modal.image = this.imageEdit;
      modal.imageRef = this.imageEditRef;
    }

    this._modalService.update(modal.id, modal).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('Modal editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(modal): void {
    this.isEditing = true;
    this.modal = modal;

  }

  getModalInfo(): void {
    this._modalService.getData().subscribe(
      data => {
        this.modal = data[0];
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
    this.getModalInfo();
    this.editModalForm = this.formBuilder.group({
      name: this.name,
      active: this.active,
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
                this.editModalForm.get('image').setValue(downloadURL);
                this.editModalForm.get('imageRef').setValue(filename);
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
