import { inject, TestBed } from '@angular/core/testing';

import { MinibannerService } from './minibanner.service';

describe('MinibannersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MinibannerService]
    });
  });

  it('should be created', inject([MinibannerService], (service: MinibannerService) => {
    expect(service).toBeTruthy();
  }));
});
