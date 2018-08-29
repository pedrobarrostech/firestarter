import { Component, ViewEncapsulation } from '@angular/core';

import { AuthService } from '../../core/_services/auth.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserProfileComponent {

  constructor(public auth: AuthService) { }

  logout(): void {
    this.auth.signOut();
  }
}
