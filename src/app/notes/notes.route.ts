
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotesListComponent } from './notes-list/notes-list.component';
import { AuthGuard } from '../core/_guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'notes', component: NotesListComponent, canActivate: [AuthGuard] }
    ])
  ]
})
export class NotesRoute { }
