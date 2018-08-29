import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { routerTransition } from '../core/_configs/router-transition.config';
import { ScrollService } from '../core/_services/scroll.service';
import { SurveyService } from './survey.service';
import { QuestionService } from '../question/question.service';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SurveyComponent implements OnInit, OnDestroy, AfterViewInit {
  addSurveyForm: FormGroup;
  bannerEditImage = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;
  questions: any = [];
  survey = {};
  surveys: any = [];

  private active = new FormControl('', Validators.required);
  private date = new FormControl('', Validators.required);
  private description = new FormControl('', Validators.required);
  private infoMsg = { body: '', type: 'info'};
  private name = new FormControl('', Validators.required);
  private questionsSelected = new FormControl('');

  constructor(
    private _questionService: QuestionService,
    private _surveyService: SurveyService,
    private _scrollService: ScrollService,
    private formBuilder: FormBuilder
  ) { }

  addSurvey(): void {
    this.addSurveyForm.get('questionsSelected').setValue(this.selectedOptions());
    this._surveyService.create(this.addSurveyForm.value).then(
      () => {
        this.addSurveyForm.reset();
        this.rerender();
        this.scrollTo('table');
      },
      error => console.error(error)
    );
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.survey = {};
    this.sendInfoMsg('Edição de enquete cancelada.', 'warning');
  }

  checkIfIsEnabled(item): void {
    // console.warn(item);
  }

  deleteSurvey(survey): void {
    if (window.confirm('Tem certeza que quer deletar esta enquete?')) {
      this._surveyService.delete(survey.id).then(
        () => {
          this.sendInfoMsg('Enquete deletado com sucesso.', 'success');
          this.getSurveys();
          this.rerender();
        },
        error => console.error(error)
      );
    }
  }

  editSurvey(survey): void {
    survey.questionsSelected = this.selectedOptions();
    this._surveyService.update(survey.id, survey).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('Enquete editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(survey): void {
    this.isEditing = true;
    survey.date = new Date(survey.date.toMillis());
    this.survey = survey;
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

  getSurveys(): void {
    this._surveyService.getData().subscribe(
      data => {
        this.surveys = data;
        this.rerender();
      },
      error => console.error(error),
      () => this.isLoading = false
    );
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.dtOptions = DATATABLES_CONFIG;
    this.getSurveys();
    this.getQuestions();
    this.addSurveyForm = this.formBuilder.group({
      name: this.name,
      date: this.date,
      description: this.description,
      questionsSelected: this.questionsSelected,
      active: this.active
    });
  }

  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then(
        (dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        },
        error => console.error(error)
      );
    }
  }

  scrollTo(id): any {
    this._scrollService.scrollTo(id);
  }

  selectedOptions(): any {
    return this.questions
              .filter(opt => opt.checked)
              .map(opt => opt.id);
  }

  sendInfoMsg(body, type, time = 3000): void {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }
}
