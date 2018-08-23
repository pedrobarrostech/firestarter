
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ArticleComponent } from './article.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'noticias', component: ArticleComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class ArticleRoute { }
