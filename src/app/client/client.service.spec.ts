import { inject, TestBed } from '@angular/core/testing';

import { ClientService } from './client.service';

describe('ClientsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientService]
    });
  });

  it('should be created', inject([ClientService], (service: ClientService) => {
    expect(service).toBeTruthy();
  }));
});
