import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import { NotifyService } from './notify.service';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface User {
  displayName?: string;
  email?: string | null;
  photoURL?: string;
  uid: string;
}

@Injectable()
export class AuthService {
  user: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  anonymousLogin(): Promise<void> {
    return this.afAuth.auth
      .signInAnonymously()
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');

        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  emailLogin(email: string, password: string): Promise<void> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.updateUserData(credential.user).then(
          () => { console.warn('Login success'); },
          error => this.handleError(error)
        );

        this.router.navigate(['/home']).then(
          () => { console.warn('Route change'); },
          error => this.handleError(error)
        );
      })
      .catch(error => this.handleError(error));
  }

  emailSignUp(email: string, password: string): Promise<void>  {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.notify.update('Welcome new user!', 'success');

        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  facebookLogin(): Promise<void> {
    const provider = new auth.FacebookAuthProvider();

    return this.oAuthLogin(provider);
  }

  githubLogin(): Promise<void> {
    const provider = new auth.GithubAuthProvider();

    return this.oAuthLogin(provider);
  }

  googleLogin(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();

    return this.oAuthLogin(provider);
  }

  resetPassword(email: string): Promise<void> {
    const fbAuth = auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => this.notify.update('Password update email sent', 'info'))
      .catch(error => this.handleError(error));
  }

  signOut(): void {
    this.afAuth.auth.signOut().then(
      () => {
        this.router.navigate(['/']).then(
          () => { console.warn('Route change'); },
          error => this.handleError(error)
        );
      },
      error => this.handleError(error)
    );
  }

  twitterLogin(): Promise<void> {
    const provider = new auth.TwitterAuthProvider();

    return this.oAuthLogin(provider);
  }

  private handleError(error: Error): void {
    console.error(error);
    this.notify.update(error.message, 'error');
  }

  private oAuthLogin(provider: any): Promise<void> {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');

        return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }

  private updateUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'nameless user',
      photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ'
    };

    return userRef.set(data);
  }
}
