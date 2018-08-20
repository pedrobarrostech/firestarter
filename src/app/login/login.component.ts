import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(public auth: AuthService,
              private router: Router) { }

  /// Social Login

  async signInWithGithub() {
    await this.auth.githubLogin();
    return this.afterSignIn();
  }

  async signInWithGoogle() {
    await this.auth.googleLogin();
    return this.afterSignIn();
  }

  async signInWithFacebook() {
    await this.auth.facebookLogin();
    await this.afterSignIn();
  }

  async signInWithTwitter() {
    await this.auth.twitterLogin();
    return this.afterSignIn();
  }

  /// Anonymous Sign In

  async signInAnonymously() {
    await this.auth.anonymousLogin();
    return this.afterSignIn();
  }

  /// Shared

  private afterSignIn() {
    // Do after login stuff here, such router redirects, toast messages, etc.
    return this.router.navigate(['/']);
  }

}
