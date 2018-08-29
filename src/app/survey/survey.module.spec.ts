import { SurveyModule } from './survey.module';

describe('SurveyModule', () => {
  let bannersModule: SurveyModule;

  beforeEach(() => {
    bannersModule = new SurveyModule();
  });

  it('should create an instance', () => {
    expect(bannersModule).toBeTruthy();
  });
});
