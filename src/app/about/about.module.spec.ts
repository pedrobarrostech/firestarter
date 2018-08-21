import { AboutModule } from './about.module';

describe('AboutModule', () => {
  let aboutsModule: AboutModule;

  beforeEach(() => {
    aboutsModule = new AboutModule();
  });

  it('should create an instance', () => {
    expect(aboutsModule).toBeTruthy();
  });
});
