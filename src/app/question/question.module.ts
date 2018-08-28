import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { QuestionComponent } from './question.component';
import { QuestionRoute } from './question.route';
import { QuestionService } from './question.service';
@NgModule({
  imports: [
    CoreModule,
    QuestionRoute
  ],
  declarations: [QuestionComponent],
  providers: [QuestionService]
})
export class QuestionModule { }
