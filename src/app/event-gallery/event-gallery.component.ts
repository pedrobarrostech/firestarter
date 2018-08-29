import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { routerTransition } from '../core/_configs/router-transition.config';

@Component({
  animations: [ routerTransition() ],
  selector: 'app-event-gallery',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EventGalleryComponent implements OnInit {

  eventId: string;
  sub: any;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.eventId = params['id'];
    });
  }
}
