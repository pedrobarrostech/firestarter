import { Component, OnInit } from '@angular/core';
import { NotesService } from '../notes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  content: string;
  notes: Observable<Array<any>>;

  constructor(private notesService: NotesService) { }

  clickHandler(): void {
    this.notesService.createNote(this.content)
      .then(
        () => console.warn('Created note!'),
        error => console.error(error)
      );
    this.content = '';
  }

  ngOnInit(): void {
    this.notes = this.notesService.getData();
  }
}
