import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MinibannerService } from '../core/_services/minibanner.service';
import { UploadService } from '../core/_services/upload.service';
import { Subject } from 'rxjs';
import datatablesConfig from '../core/_configs/datatable-pt-br.config';
import * as firebase from 'firebase';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-minibanner',
  templateUrl: './minibanner.component.html',
  styleUrls: ['./minibanner.component.scss']
})
export class MinibannerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  addMinibannerForm: FormGroup;
  dtElement: DataTableDirective;
  dtTrigger = new Subject();
  isLoading = true;

  private active = new FormControl('', Validators.required);
  private bannerEditImage = {};
  private dtOptions: DataTables.Settings = {};
  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info'};
  private isEditing = false;
  private link = new FormControl('', Validators.required);
  private minibanner = {};
  private minibanners: any = [];
  private name = new FormControl('', Validators.required);
  private order = new FormControl('', Validators.required);

  constructor(private _minibannerService: MinibannerService, private formBuilder: FormBuilder) { }

  addMinibanner(): void {
    this._minibannerService.create(this.addMinibannerForm.value).then(
      res => {
        this.addMinibannerForm.reset();
        this.rerender();
      },
      error => console.error(error)
    );
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.minibanner = {};
    this.sendInfoMsg('Edição de minibanner cancelada.', 'warning');
  }

  deleteMinibanner(minibanner): void {
    if (window.confirm('Tem certeza que quer deletar este minibanner?')) {
      this._minibannerService.delete(minibanner.id).then(
        res => {
          UploadService.deleteFile(minibanner.imageRef);
          this.sendInfoMsg('Minibanner deletado com sucesso.', 'success');
          this.getMinibanners();
          this.rerender();
        },
        error => console.error(error)
      );
    }
  }

  editMinibanner(minibanner): void {
    if (this.imageEdit) {
      minibanner.image = this.imageEdit;
      minibanner.imageRef = this.imageEditRef;
    }

    this._minibannerService.update(minibanner.id, minibanner).then(
      res => {
        this.isEditing = false;
        this.sendInfoMsg('Minibanner editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(minibanner): void {
    this.isEditing = true;
    this.minibanner = minibanner;
  }

  getMinibanners(): void {
    this._minibannerService.getData().subscribe(
      data => {
        this.minibanners = data;
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
    this.dtOptions = datatablesConfig;
    this.getMinibanners();
    this.addMinibannerForm = this.formBuilder.group({
      name: this.name,
      order: this.order,
      link: this.link,
      image: null,
      imageRef: null,
      active: this.active
    });
  }

  async onFileChange(event): Promise<void> {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {

        const filename = UploadService.generateId() + file.name;
        const ref = firebase.storage().ref();
        const storageRef = ref.child(filename);
        storageRef.put(file).then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            this.addMinibannerForm.get('image').setValue(downloadURL);
            this.addMinibannerForm.get('imageRef').setValue(filename);
            this.imageEdit = downloadURL;
            this.imageEditRef = filename;
          });
        });
      };
    }
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  }

  sendInfoMsg(body, type, time = 3000): void {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }
}
