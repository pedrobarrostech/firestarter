import { Component, ViewEncapsulation } from '@angular/core';
import { NotifyService } from '../../core/_services/notify.service';

@Component({
  selector: 'notification-message',
  templateUrl: './notification-message.component.html',
  styleUrls: ['./notification-message.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class NotificationMessageComponent {

  constructor(public notify: NotifyService) { }
}
