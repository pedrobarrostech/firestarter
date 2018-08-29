import { Component, ViewEncapsulation } from '@angular/core';
import { routerTransition } from '../core/_configs/router-transition.config';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent  {
}
