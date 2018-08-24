import { Injectable } from '@angular/core';

@Injectable()
export class ScrollService {

  scrollTo(_index: any): void {
    const element = document.getElementsByClassName(_index)[0];
    element.scrollIntoView();
  }
}
