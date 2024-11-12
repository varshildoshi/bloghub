import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthNotice } from './auth-notice.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthNoticeService {

  onNoticeChanged$: BehaviorSubject<AuthNotice>;
  onNoticeChangedAuth$: BehaviorSubject<Array<any>>;

  constructor() {
    this.onNoticeChanged$ = new BehaviorSubject(null);
    this.onNoticeChangedAuth$ = new BehaviorSubject(null);
  }

  setNotice(message: any, type?: any) {
    const notice: AuthNotice = {
      message,
      type
    };
    this.onNoticeChanged$.next(!notice ? null : notice);
  }

  setAuthNotice(message: any) {
    this.onNoticeChangedAuth$.next(!message ? of([]) : message);
  }
}
