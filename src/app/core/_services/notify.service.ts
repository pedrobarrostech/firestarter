import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

/// Notify users about errors and other helpful stuff
export interface Msg {
  content: string;
  style: string;
}

@Injectable()
export class NotifyService {
  messageSource = new Subject<Msg | null>();
  msg = this.messageSource.asObservable();

  clear(): void {
    this.messageSource.next(null);
  }

  update(content: string, style: 'error' | 'info' | 'success'): void {
    const msg: Msg = { content, style };
    this.messageSource.next(msg);
  }
}
