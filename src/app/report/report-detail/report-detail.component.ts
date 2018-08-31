import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { routerTransition } from '../../core/_configs/router-transition.config';
import { AnswerService } from '../../core/_services/answer.service';
import { QuestionService } from '../../question/question.service';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ReportDetailComponent implements OnInit {
  answers: any = [];
  answersCountage: any = [];
  data: any;
  id: string;
  isLoading = true;
  questions: any = [];
  sub: any;

  constructor(
    private _questionService: QuestionService,
    private _answerService: AnswerService,
    private route: ActivatedRoute
  ) {
  }

  getAnwsers(id): void {
    this._answerService.getAnswerBySurveyId(id).subscribe(
      data => {
        this.answers = data;

        if (this.answers.length > 0) {
          this.answersCountage = this.answers.reduce((obj, answer) => {
            obj[answer.questionId] = obj[answer.group] || [];
            obj[answer.questionId].push([answer.value, answer.count ]);

            return obj;
          }, {});
        }
      },
      error => console.error(error),
      () => this.isLoading = false
    );
  }

  getQuestions(): void {
    this._questionService.getData().subscribe(
      data => {
        this.questions = data;
      },
      error => console.error(error),
      () => this.isLoading = false
    );
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getAnwsers(this.id);
      this.getQuestions();
    });
  }

  viewReport(report): void {
    console.warn(report);
  }
}
