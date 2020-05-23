import {sortBy} from 'lodash-es';
import {Observable, of} from 'rxjs';
import {IQuest} from '../../questlist/IQuest';
import qList from '../../questlist/questlist.json';

export const rawQuests$: Observable<IQuest[]> = of(sortBy(qList, 'name') as any);
