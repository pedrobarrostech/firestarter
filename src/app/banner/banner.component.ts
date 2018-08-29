import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import * as firebase from 'firebase';

import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { routerTransition } from '../core/_configs/router-transition.config';
import { ScrollService } from '../core/_services/scroll.service';
import { BannerService } from './banner.service';
import { UploadService } from '../core/_services/upload.service';
@Component({
  animations: [ routerTransition() ],
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class BannerComponent implements OnInit, OnDestroy, AfterViewInit {
  addBannerForm: FormGroup;
  banner = {};
  bannerEditImage = {};
  banners: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;

  private active = new FormControl('', Validators.required);
  private dateFinal = new FormControl('', Validators.required);
  private dateInit = new FormControl('', Validators.required);
  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info' };
  private link = new FormControl('', Validators.required);
  private name = new FormControl('', Validators.required);
  private order = new FormControl('', Validators.required);

  constructor(
    private _bannerService: BannerService,
    private _scrollService: ScrollService,
    private formBuilder: FormBuilder
  ) { }

  addBanner(): void {
    window.setTimeout(() => {
      this._bannerService.create(this.addBannerForm.value).then(
        () => {
          this.addBannerForm.reset();
          this.rerender();
          this.scrollTo('table');
        },
        error => console.error(error)
      );
    }, 1000);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.banner = {};
    this.sendInfoMsg('Edição de banner cancelada.', 'warning');
  }

  deleteBanner(banner): void {
    if (window.confirm('Tem certeza que quer deletar este banner?')) {
      this._bannerService.delete(banner.id).then(
        () => {
          UploadService.deleteFile(banner.imageRef).then(
            () => {
              this.sendInfoMsg('Banner deletado com sucesso.', 'success');
              this.getBanners();
              this.rerender();
            },
            error => console.error(error)
          );
        },
        error => console.error(error)
      );
    }
  }

  editBanner(banner): void {
    if (this.imageEdit) {
      banner.image = this.imageEdit;
      banner.imageRef = this.imageEditRef;
    }

    this._bannerService.update(banner.id, banner).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('Banner editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(banner): void {
    this.isEditing = true;
    banner.dateInit = new Date(banner.dateInit.toMillis());
    banner.dateFinal = new Date(banner.dateFinal.toMillis());
    this.banner = banner;

  }

  getBanners(): void {
    this._bannerService.getData().subscribe(
      data => {
        this.banners = data;
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
                this.addBannerForm.get('image').setValue(downloadURL);
                this.addBannerForm.get('imageRef').setValue(filename);
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
