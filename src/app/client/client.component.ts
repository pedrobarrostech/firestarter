import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from './client.service';
import { Subject } from 'rxjs';
import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { DataTableDirective } from 'angular-datatables';
import { routerTransition } from '../core/_configs/router-transition.config';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy, AfterViewInit {
  addClientForm: FormGroup;
  bannerEditImage = {};
  client = {};
  clients: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;

  private infoMsg = { body: '', type: 'info'};
  private isOnGroup = new FormControl('', Validators.required);
  private name = new FormControl('', Validators.required);
  private phone = new FormControl('', Validators.required);

  constructor(private _clientService: ClientService, private formBuilder: FormBuilder) { }

  addClient(): void {
    window.setTimeout(() => {
      this._clientService.create(this.addClientForm.value).then(
        res => {
          this.addClientForm.reset();
          this.rerender();
        },
        error => console.error(error)
      );
    }, 1000);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.client = {};
    this.sendInfoMsg('Edição de client cancelada.', 'warning');
  }

  deleteClient(client): void {
    if (window.confirm('Tem certeza que quer deletar este client?')) {
      this._clientService.delete(client.id).then(
        () => {
          this.sendInfoMsg('Client deletado com sucesso.', 'success');
          this.getClients();
          this.rerender();
        },
        error => console.error(error)
      );
    }
  }

  editClient(client): void {

    this._clientService.update(client.id, client).then(
      res => {
        this.isEditing = false;
        this.sendInfoMsg('Client editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(client): void {
    this.isEditing = true;
    this.client = client;
  }

  getClients(): void {
    this._clientService.getData().subscribe(
      data => {
        this.clients = data;
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
    this.getClients();
    this.addClientForm = this.formBuilder.group({
      name: this.name,
      phone: this.phone,
      isOnGroup: this.isOnGroup
    });
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
