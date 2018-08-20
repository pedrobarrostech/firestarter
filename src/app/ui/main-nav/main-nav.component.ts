import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/_services/auth.service';
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  show = false;

  constructor(public auth: AuthService) { }

  logout(): void {
    this.auth.signOut();
  }

  toggleCollapse(): void {
    this.show = !this.show;
  }

}
