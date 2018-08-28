import { QuestionModule } from './question.module';

describe('QuestionModule', () => {
  let bannersModule: QuestionModule;

  beforeEach(() => {
    bannersModule = new QuestionModule();
  });

  it('should create an instance', () => {
    expect(bannersModule).toBeTruthy();
  });
});
