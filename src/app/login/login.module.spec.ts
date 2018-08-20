import { LoginModule } from './login.module';

describe('LoginModule', () => {
  let bannersModule: LoginModule;

  beforeEach(() => {
    bannersModule = new LoginModule();
  });

  it('should create an instance', () => {
    expect(bannersModule).toBeTruthy();
  });
});
