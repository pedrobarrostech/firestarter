import { Component, Input } from '@angular/core';

import { NotesService } from '../notes.service';

@Component({
  selector: 'note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent {

  @Input() note: any;

  constructor(private notesService: NotesService) { }

  addHeartToNote(val: number): void {
    if (this.note.id) {
      this.notesService.updateNote(this.note.id, { hearts: val + 1 })
        .then(
          () => console.warn('Updated note!'),
          error => console.error(error)
        );
    } else {
      console.error('Note missing ID!');
    }
  }

  deleteNote(id: string): void {
    this.notesService.deleteNote(id)
      .then(
        () => console.warn('Deleted note!'),
        error => console.error(error)
      );
  }

}
