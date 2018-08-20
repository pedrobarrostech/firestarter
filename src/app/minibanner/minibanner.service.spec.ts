import { TestBed, inject } from '@angular/core/testing';

import { MinibannerService } from '../core/_services/minibanner.service';

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
