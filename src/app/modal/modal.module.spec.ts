import { ModalModule } from './modal.module';

describe('ModalModule', () => {
  let modalsModule: ModalModule;

  beforeEach(() => {
    modalsModule = new ModalModule();
  });

  it('should create an instance', () => {
    expect(modalsModule).toBeTruthy();
  });
});
