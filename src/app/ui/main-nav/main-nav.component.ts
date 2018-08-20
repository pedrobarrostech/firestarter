import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/_services/auth.service';
@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  public show = false;

  constructor(public auth: AuthService) { }

  toggleCollapse(): void {
    this.show = !this.show;
  }

  logout(): void {
    this.auth.signOut();
  }

}
