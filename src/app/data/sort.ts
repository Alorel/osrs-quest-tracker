import {BehaviorSubject} from 'rxjs';
import {skip} from 'rxjs/operators';
import {IQuest} from '../../questlist/IQuest';
import {StoreKey} from '../StoreKey';
import {getValueFromStorage} from '../util/getValueFromStorage';

export const sort$ = new BehaviorSubject<(keyof IQuest) | null>(getValueFromStorage(
  StoreKey.SORT,
  null
));

sort$.pipe(skip(1)).subscribe(v => {
  localStorage.setItem(StoreKey.SORT, JSON.stringify(v));
});
