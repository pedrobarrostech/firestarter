import { inject, TestBed } from '@angular/core/testing';

import { SurveyService } from './survey.service';

describe('SurveysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurveyService]
    });
  });

  it('should be created', inject([SurveyService], (service: SurveyService) => {
    expect(service).toBeTruthy();
  }));
});
