import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private isSpinnerShow = new BehaviorSubject<boolean>(false);
  spinnerStateChanged = this.isSpinnerShow.asObservable();

  constructor() { }

  show() {
    this.isSpinnerShow.next(true);
  }

  hide() {
    this.isSpinnerShow.next(false);
  }

}
