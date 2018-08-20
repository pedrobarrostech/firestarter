import { BannerModule } from './banner.module';

describe('BannerModule', () => {
  let bannersModule: BannerModule;

  beforeEach(() => {
    bannersModule = new BannerModule();
  });

  it('should create an instance', () => {
    expect(bannersModule).toBeTruthy();
  });
});
