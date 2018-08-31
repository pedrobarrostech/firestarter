import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { ArticleComponent } from './article.component';
import { ArticleRoute } from './article.route';
import { ArticleService } from './article.service';
@NgModule({
  imports: [
    CoreModule,
    ArticleRoute
  ],
  declarations: [ArticleComponent],
  providers: [
    ArticleService
  ]
})
export class ArticleModule { }
