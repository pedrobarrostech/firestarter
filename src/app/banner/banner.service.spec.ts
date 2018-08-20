import { TestBed, inject } from '@angular/core/testing';

import { BannerService } from './banner.service';

xdescribe('BannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BannerService]
    });
  });

  it('should be created', inject([BannerService], (service: BannerService) => {
    expect(service).toBeTruthy();
  }));
});
