import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

import { ScrollService } from '../core/_services/scroll.service';
import { EventService } from './event.service';
import { UploadService } from '../core/_services/upload.service';
import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { routerTransition } from '../core/_configs/router-transition.config';
@Component({
  animations: [ routerTransition() ],
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EventComponent implements OnInit, OnDestroy, AfterViewInit {
  addEventForm: FormGroup;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  event = {};
  eventEditImage = {};
  events: any = [];
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;

  private active = new FormControl('', Validators.required);
  private date = new FormControl('', Validators.required);
  private description = new FormControl('', Validators.required);
  private femalePrice = new FormControl('', Validators.required);
  private hasList = new FormControl('', Validators.required);
  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info' };
  private limitList = new FormControl('', Validators.required);
  private malePrice = new FormControl('', Validators.required);
  private name = new FormControl('', Validators.required);
  private timeFinishList = new FormControl('', Validators.required);

  constructor(
    private _eventService: EventService,
    private _scrollService: ScrollService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  addEvent(): void {
    window.setTimeout(() => {
      console.warn(this.addEventForm.value);
      this._eventService.create(this.addEventForm.value).then(
        () => {
          this.addEventForm.reset();
          this.rerender();
          this.scrollTo('table');
        },
        error => console.error(error)
      );
    }, 1000);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.event = {};
    this.sendInfoMsg('Edição de evento cancelada.', 'warning');
  }

  deleteEvent(event): void {
    if (window.confirm('Tem certeza que quer deletar este event?')) {
      this._eventService.delete(event.id).then(
        () => {
          UploadService.deleteFile(event.imageRef).then(
            () => {
              this.sendInfoMsg('Evento deletado com sucesso.', 'success');
              this.getEvents();
              this.rerender();
            },
            error => console.error(error)
          );
        },
        error => console.error(error)
      );
    }
  }

  editEvent(event): void {
    if (this.imageEdit) {
      event.image = this.imageEdit;
      event.imageRef = this.imageEditRef;
    }

    this._eventService.update(event.id, event).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('Evento editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(event): void {
    this.isEditing = true;
    event.date = new Date(event.date.toMillis());
    event.timeFinishList = new Date(event.timeFinishList.toMillis());
    this.event = event;
  }

  galleryEvent(event): void {
    this.router.navigate(['/galerias', event.id]).then(
      () => {
        console.warn('Route change');
      },
      error => console.error(error)
    );
  }

  getEvents(): void {
    this._eventService.getData().subscribe(
      data => {
        this.events = data;
        this.rerender();
      },
      error => console.error(error),
      () => this.isLoading = false
    );
  }

  listEvent(event): void {
    this.router.navigate(['/reservas', event.id]).then(
      () => {
        console.warn('Route change');
      },
      error => console.error(error)
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
    this.getEvents();
    this.addEventForm = this.formBuilder.group({
      name: this.name,
      date: this.date,
      timeFinishList: this.timeFinishList,
      malePrice: this.malePrice,
      femalePrice: this.femalePrice,
      description: this.description,
      image: null,
      imageRef: null,
      hasList: this.hasList,
      limitList: this.limitList,
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
                this.addEventForm.get('image').setValue(downloadURL);
                this.addEventForm.get('imageRef').setValue(filename);
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
