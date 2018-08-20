import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
  public dtElement: DataTableDirective;
  public dtTrigger = new Subject();
  public isLoading = true;
  public addMinibannerForm: FormGroup;
  private name = new FormControl('', Validators.required);
  private order = new FormControl('', Validators.required);
  private active = new FormControl('', Validators.required);
  private link = new FormControl('', Validators.required);
  private infoMsg = { body: '', type: 'info'};
  private minibanners: any = [];
  private minibanner = {};
  private imageEdit;
  private imageEditRef;
  private isEditing = false;
  private dtOptions: DataTables.Settings = {};
  private bannerEditImage = {};

  constructor(private _minibannerService: MinibannerService, private formBuilder: FormBuilder) { }

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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getMinibanners(): void {
    this._minibannerService.getData().subscribe(
      data => {
        this.minibanners = data;
        this.rerender();
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addMinibanner(): void {
    this._minibannerService.create(this.addMinibannerForm.value).then(
      res => {
        this.addMinibannerForm.reset();
        this.rerender();
      },
      error => console.log(error)
    );
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
      error => console.log(error)
    );
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
        error => console.log(error)
      );
    }
  }

  async onFileChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {

        const filename = UploadService.generateId() + file.name;
        const ref = firebase.storage().ref();
        const storageRef = ref.child(filename);
        storageRef.put(file).then((snapshot) => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.addMinibannerForm.get('image').setValue(downloadURL);
            this.addMinibannerForm.get('imageRef').setValue(filename);
            this.imageEdit = downloadURL;
            this.imageEditRef = filename;
          });
        });
      };
    }
  }

  enableEditing(minibanner): void {
    this.isEditing = true;
    this.minibanner = minibanner;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.minibanner = {};
    this.sendInfoMsg('Edição de minibanner cancelada.', 'warning');
  }

  sendInfoMsg(body, type, time = 3000): void {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

}
