import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import { DataTableDirective } from 'angular-datatables';

import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { routerTransition } from '../core/_configs/router-transition.config';
import { MinibannerService } from './minibanner.service';
import { UploadService } from '../core/_services/upload.service';
import { ScrollService } from '../core/_services/scroll.service';
@Component({
  animations: [ routerTransition() ],
  selector: 'app-minibanner',
  templateUrl: './minibanner.component.html',
  styleUrls: ['./minibanner.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MinibannerComponent implements OnInit, OnDestroy, AfterViewInit {
  addMinibannerForm: FormGroup;
  bannerEditImage = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;
  minibanner = {};
  minibanners: any = [];

  private active = new FormControl('', Validators.required);
  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info'};
  private link = new FormControl('', Validators.required);
  private name = new FormControl('', Validators.required);
  private order = new FormControl('', Validators.required);

  constructor(
    private _scrollService: ScrollService,
    private _minibannerService: MinibannerService,
    private formBuilder: FormBuilder
  ) { }

  addMinibanner(): void {
    window.setTimeout(() => {
      this._minibannerService.create(this.addMinibannerForm.value).then(
        res => {
          this.addMinibannerForm.reset();
          this.rerender();
          this.scrollTo('table');
        },
        error => console.error(error)
      );
    }, 1000);
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
          UploadService.deleteFile(minibanner.imageRef)
            .then(
              () => { console.warn('Deleted file!'); },
              error => console.error(error)
            );
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
    this.dtOptions = DATATABLES_CONFIG;
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
      this.imageUploadStatus = false;
      reader.readAsDataURL(file);
      reader.onload = () => {

        const filename = UploadService.generateId() + file.name;
        const ref = firebase.storage().ref();
        const storageRef = ref.child(filename);
        storageRef.put(file).then(
          snapshot => {
            snapshot.ref.getDownloadURL().then(
              downloadURL => {
                this.addMinibannerForm.get('image').setValue(downloadURL);
                this.addMinibannerForm.get('imageRef').setValue(filename);
                this.imageEdit = downloadURL;
                this.imageEditRef = filename;
                this.imageUploadStatus = true;
              },
              error => console.error(error));
          },
          error => console.error(error));
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
