import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import { routerTransition } from '../core/_configs/router-transition.config';
import { ScrollService } from '../core/_services/scroll.service';
import { QuestionService } from './question.service';
@Component({
  animations: [ routerTransition() ],
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy, AfterViewInit {
  addQuestionForm: FormGroup;
  bannerEditImage = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;
  question = {};
  questions: any = [];
  types = [
    { id: 1, name: 'Texto', type: 'text' },
    { id: 2, name: 'Texto longo', type: 'textarea' },
    { id: 3, name: 'Opção', type: 'radio' },
    { id: 4, name: 'Checkbox', type: 'checkbox' }
  ];
  values = [];

  private infoMsg = { body: '', type: 'info'};
  private name = new FormControl('', Validators.required);
  private type = new FormControl('', Validators.required);
  private value = new FormControl('');

  constructor(
    private _questionService: QuestionService,
    private _scrollService: ScrollService,
    private formBuilder: FormBuilder
  ) { }

  addQuestion(): void {
    window.setTimeout(() => {
      this.addQuestionForm.get('value').setValue(this.values);
      this._questionService.create(this.addQuestionForm.value).then(
        () => {
          this.values = [];
          this.addQuestionForm.reset();
          this.rerender();
          this.scrollTo('table');
        },
        error => console.error(error)
      );
    }, 1000);
  }

  addValue(newValue: string): void {
    if (newValue) {
      this.values.push(newValue);
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.question = {};
    this.sendInfoMsg('Edição de question cancelada.', 'warning');
  }

  deleteQuestion(question): void {
    if (window.confirm('Tem certeza que quer deletar este question?')) {
      this._questionService.delete(question.id).then(
        () => {
          this.sendInfoMsg('Question deletado com sucesso.', 'success');
          this.getQuestions();
          this.rerender();
        },
        error => console.error(error)
      );
    }
  }

  editQuestion(question): void {
    question.value = this.values;
    this._questionService.update(question.id, question).then(
      () => {
        this.values = [];
        this.isEditing = false;
        this.sendInfoMsg('Question editado com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(question): void {
    this.isEditing = true;
    this.question = question;
    this.values = question.value;
  }

  getQuestions(): void {
    this._questionService.getData().subscribe(
      data => {
        this.questions = data;
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
    this.getQuestions();
    this.addQuestionForm = this.formBuilder.group({
      name: this.name,
      type: this.type,
      value: this.value
    });
  }

  removeValue(index: number): void {
    if (index > -1) {
      this.values.splice(index, 1);
    }
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

  sendInfoMsg(body, type, time = 3000): void {
    this.infoMsg.body = body;
    this.infoMsg.type = type;
    window.setTimeout(() => this.infoMsg.body = '', time);
  }
}
