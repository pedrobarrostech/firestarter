import { HomeModule } from './home.module';

describe('HomeModule', () => {
  let bannersModule: HomeModule;

  beforeEach(() => {
    bannersModule = new HomeModule();
  });

  it('should create an instance', () => {
    expect(bannersModule).toBeTruthy();
  });
});
