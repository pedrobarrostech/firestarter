import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from './article.service';
import { UploadService } from '../core/_services/upload.service';
import { Subject } from 'rxjs';
import { DATATABLES_CONFIG } from '../core/_configs/datatable-pt-br.config';
import * as firebase from 'firebase';
import { DataTableDirective } from 'angular-datatables';
import { routerTransition } from '../core/_configs/router-transition.config';
import { ScrollService } from '../core/_services/scroll.service';
@Component({
  animations: [ routerTransition() ],
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ArticleComponent implements OnInit, OnDestroy, AfterViewInit {
  addArticleForm: FormGroup;
  article = {};
  articleEditImage = {};
  articles: any = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  imageUploadStatus = true;
  isEditing = false;
  isLoading = true;

  private active = new FormControl('', Validators.required);
  private date = new FormControl('', Validators.required);
  private description = new FormControl('', Validators.required);
  private imageEdit;
  private imageEditRef;
  private infoMsg = { body: '', type: 'info' };
  private name = new FormControl('', Validators.required);
  private video = new FormControl('');

  constructor(private _articleService: ArticleService, private _scrollService: ScrollService, private formBuilder: FormBuilder) { }

  addArticle(): void {
    window.setTimeout(() => {
      this._articleService.create(this.addArticleForm.value).then(
        () => {
          this.addArticleForm.reset();
          this.rerender();
          this.scrollTo('table');
        },
        error => console.error(error)
      );
    }, 1000);
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.article = {};
    this.sendInfoMsg('Edição de article cancelada.', 'warning');
  }

  deleteArticle(article): void {
    if (window.confirm('Tem certeza que quer deletar esta notícia?')) {
      this._articleService.delete(article.id).then(
        () => {
          UploadService.deleteFile(article.imageRef).then(
            () => {
              this.sendInfoMsg('Notícia deletada com sucesso.', 'success');
              this.getArticles();
              this.rerender();
            },
            error => console.error(error)
          );
        },
        error => console.error(error)
      );
    }
  }

  editArticle(article): void {
    if (this.imageEdit) {
      article.image = this.imageEdit;
      article.imageRef = this.imageEditRef;
    }

    this._articleService.update(article.id, article).then(
      () => {
        this.isEditing = false;
        this.sendInfoMsg('Notícia editada com sucesso.', 'success');
        this.rerender();
      },
      error => console.error(error)
    );
  }

  enableEditing(article): void {
    this.isEditing = true;
    article.date = new Date(article.date.toMillis());
    this.article = article;

  }

  getArticles(): void {
    this._articleService.getData().subscribe(
      data => {
        this.articles = data;
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
    this.getArticles();
    this.addArticleForm = this.formBuilder.group({
      name: this.name,
      video: this.video,
      date: this.date,
      description: this.description,
      image: null,
      imageRef: null,
      active: this.active
    });
  }

  async onFileChange(article): Promise<void> {
    if (article.target.files && article.target.files.length > 0) {
      const reader = new FileReader();
      const file = article.target.files[0];
      this.imageUploadStatus = false;
      reader.readAsDataURL(file);
      reader.onload = () => {

        const filename = `${UploadService.generateId()}${file.name}`;
        const ref = firebase.storage().ref();
        const storageRef = ref.child(filename);
        storageRef.put(file).then(
          snapshot => {
            snapshot.ref.getDownloadURL().then(
              downloadURL => {
                this.addArticleForm.get('image').setValue(downloadURL);
                this.addArticleForm.get('imageRef').setValue(filename);
                this.imageEdit = downloadURL;
                this.imageEditRef = filename;
                this.imageUploadStatus = true;
              },
              error => console.error(error));
          },
          error => console.error(error)
        );
      };
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
