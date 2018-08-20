import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../_services/auth.service';
import { NotifyService } from '../_services/notify.service';
import { AngularFireAuthModule } from 'angularfire2/auth';

xdescribe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireAuthModule
      ],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: { afAuth: { } } },
        { provide: NotifyService, useValue: { } }
      ]
    });
  });

  // it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
  // }));
});
