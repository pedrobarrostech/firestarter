import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { ClientComponent } from './client.component';
import { ClientRoute } from './client.route';
import { ClientService } from './client.service';
@NgModule({
  imports: [
    CoreModule,
    ClientRoute
  ],
  declarations: [ClientComponent],
  providers: [ClientService]
})
export class ClientModule { }
