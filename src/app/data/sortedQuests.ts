import {sortBy} from 'lodash-es';
import {combineLatest, Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {IQuest} from '../../questlist/IQuest';
import {filteredQuests$} from './filteredQuests';
import {sort$} from './sort';

export const sortedQuests$: Observable<IQuest[]> = combineLatest([filteredQuests$, sort$]).pipe(
  map(([raw, sort]) => {
    if (!sort) {
      return raw;
    } else if (sort === 'length') {
      return sortBy(raw, (q: IQuest) => Array.isArray(q.length) ? ((q.length[0] + q.length[1]) / 2) : q.length);
    } else {
      return sortBy(raw, sort);
    }
  }),
  shareReplay(1)
);
