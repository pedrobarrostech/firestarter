import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';

import { NotesListComponent } from './notes-list/notes-list.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';
import { NotesRoute } from './notes.route';
import { NotesService } from './notes.service';

@NgModule({
  imports: [
    CoreModule,
    NotesRoute
  ],
  declarations: [NotesListComponent, NoteDetailComponent],
  providers: [NotesService]
})
export class NotesModule { }
