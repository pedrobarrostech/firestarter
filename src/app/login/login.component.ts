import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/_services/auth.service';
import { routerTransition } from '../core/_configs/router-transition.config';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class LoginComponent {

  constructor(public auth: AuthService,
              private router: Router) { }

  async signInAnonymously(): Promise<boolean> {
    await this.auth.anonymousLogin();

    return this.afterSignIn();
  }

  async signInWithFacebook(): Promise<void> {
    await this.auth.facebookLogin();
    await this.afterSignIn();
  }

  async signInWithGithub(): Promise<boolean> {
    await this.auth.githubLogin();

    return this.afterSignIn();
  }

  async signInWithGoogle(): Promise<boolean> {
    await this.auth.googleLogin();

    return this.afterSignIn();
  }

  async signInWithTwitter(): Promise<boolean> {
    await this.auth.twitterLogin();

    return this.afterSignIn();
  }

  private afterSignIn(): Promise<boolean> {
    // Do after login stuff here, such router redirects, toast messages, etc.
    return this.router.navigate(['/']);
  }

}
