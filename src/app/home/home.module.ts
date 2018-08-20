import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { HomeComponent } from './home.component';
import { HomeRoute } from './home.route';
@NgModule({
  imports: [
    CoreModule,
    HomeRoute
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
