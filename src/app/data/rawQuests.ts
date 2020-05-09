import {defer, from, Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {IQuest} from '../../questlist/IQuest';

export const rawQuests$: Observable<IQuest[]> = defer(() => from(import('../../questlist/questlist.json'))).pipe(
  map((data: any): IQuest[] => data.default),
  shareReplay(1)
);
