import 'rxjs/add/operator/delay';
import {Observable} from 'rxjs/Observable';

function delayAtLeast<T>(this: Observable<T>, minDelay: number): Observable<T> {
  const now = Date.now();
  const target = now + minDelay;
  const targetDate = new Date(target);
  return this.delay(targetDate);
}

Observable.prototype.delayAtLeast = delayAtLeast;

declare module 'rxjs/observable' {
  interface Observable<T> {
    delayAtLeast: typeof delayAtLeast;
  }
}
