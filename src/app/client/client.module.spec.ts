import { ClientModule } from './client.module';

describe('ClientModule', () => {
  let bannersModule: ClientModule;

  beforeEach(() => {
    bannersModule = new ClientModule();
  });

  it('should create an instance', () => {
    expect(bannersModule).toBeTruthy();
  });
});
