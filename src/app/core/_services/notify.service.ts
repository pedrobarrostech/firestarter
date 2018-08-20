import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

/// Notify users about errors and other helpful stuff
export interface Msg {
  content: string;
  style: string;
}

@Injectable()
export class NotifyService {
  msgSource = new Subject<Msg | null>();
  msg = this.msgSource.asObservable();

  clear(): void {
    this.msgSource.next(null);
  }

  update(content: string, style: 'error' | 'info' | 'success'): void {
    const msg: Msg = { content, style };
    this.msgSource.next(msg);
  }
}
