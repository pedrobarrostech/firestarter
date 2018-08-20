import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BannerService } from './banner.service';
import { UploadService } from '../core/_services/upload.service';
import { Subject } from 'rxjs';
import datatablesConfig from '../core/_configs/datatable-pt-br.config';
import * as firebase from 'firebase';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  public dtTrigger = new Subject();
  public isLoading = true;
  public addBannerForm: FormGroup;
  private name = new FormControl('', Validators.required);
  private order = new FormControl('', Validators.required);
  private active = new FormControl('', Validators.required);
  private link = new FormControl('', Validators.required);
  private dateInit = new FormControl('', Validators.required);
  private dateFinal = new FormControl('', Validators.required);
  private infoMsg = { body: '', type: 'info' };
  private banners: any = [];
  private banner = {};
  private imageEdit;
  private imageEditRef;
  private isEditing = false;
  private dtOptions: DataTables.Settings = {};
  private bannerEditImage = {};

  constructor(private _bannerService: BannerService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.dtOptions = datatablesConfig;
    this.getBanners();
    this.addBannerForm = this.formBuilder.group({
      name: this.name,
      order: this.order,
      link: this.link,
      dateInit: this.dateInit,
      dateFinal: this.dateFinal,
      image: null,
      imageRef: null,
      active: this.active
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getBanners(): void {
    this._bannerService.getData().subscribe(
      data => {
        this.banners = data;
        this.rerender();
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addBanner(): void {
    this._bannerService.create(this.addBannerForm.value).then(
      res => {
        this.addBannerForm.reset();
        this.rerender();
      },
      error => console.log(error)
    );
  }

  editBanner(banner): void {
    if (this.imageEdit) {
      banner.image = this.imageEdit;
      banner.imageRef = this.imageEditRef;
    }

    this._bannerService.update(banner.id, banner).then(
      res => {
        this.isEditing = false;
        this.sendInfoMsg('Banner editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.log(error)
    );
  }

  deleteBanner(banner): void {
    if (window.confirm('Tem certeza que quer deletar este banner?')) {
      this._bannerService.delete(banner.id).then(
        res => {
          UploadService.deleteFile(banner.imageRef);
          this.sendInfoMsg('Banner deletado com sucesso.', 'success');
          this.getBanners();
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
            this.addBannerForm.get('image').setValue(downloadURL);
            this.addBannerForm.get('imageRef').setValue(filename);
            this.imageEdit = downloadURL;
            this.imageEditRef = filename;
          });
        });
      };
    }
  }

  enableEditing(banner): void {
    this.isEditing = true;
    banner.dateInit = new Date(banner.dateInit.toMillis());
    banner.dateFinal = new Date(banner.dateFinal.toMillis());
    this.banner = banner;

  }

  cancelEditing(): void {
    this.isEditing = false;
    this.banner = {};
    this.sendInfoMsg('Edição de banner cancelada.', 'warning');
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
