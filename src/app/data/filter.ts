import {isEqual} from 'lodash-es';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, skip} from 'rxjs/operators';
import {QuestDifficulty} from '../../questlist/QuestDifficulty';
import {QuestLength} from '../../questlist/QuestLength';
import {difficultyEntries} from '../questlist/QuestDifficultyDisplay';
import {lengthEntries} from '../questlist/QuestLengthDisplay';
import {StoreKey} from '../StoreKey';
import {getValueFromStorage} from '../util/getValueFromStorage';

export const nameFilter$ = new BehaviorSubject<string | null>(getValueFromStorage(StoreKey.NAME, null));
export const lengthFilter$ = new BehaviorSubject<QuestLength[] | null>(getValueFromStorage(
  StoreKey.LENGTH_FILTER,
  lengthEntries.map(([e]) => e)
));
export const difficultyFilter$ = new BehaviorSubject<QuestDifficulty[] | null>(getValueFromStorage(
  StoreKey.DIFFICULTY_FILTER,
  difficultyEntries.map(([e]) => e)
));
export const memberFilter$ = new BehaviorSubject<boolean | null>(getValueFromStorage(StoreKey.MEMB_FILTER, null));
export const hideCompletedFilter$ = new BehaviorSubject<boolean>(getValueFromStorage(
  StoreKey.HIDE_COMPLETED, false
));
export const hideIncompleteFilter$ = new BehaviorSubject<boolean>(getValueFromStorage(
  StoreKey.HIDE_INCOMPLETE, false
));
export const hideMissingReqFilter$ = new BehaviorSubject<boolean>(getValueFromStorage(
  StoreKey.HIDE_MISSING_REQUIREMENTS, false
));

export interface QuestFilter {
  difficulty?: QuestDifficulty[];

  hideCompleted?: boolean;

  hideIncomplete?: boolean;

  hideMissingReq?: boolean;

  length?: QuestLength[];

  members?: boolean;

  name?: string;
}

const filterSource$ = combineLatest([
  nameFilter$,
  lengthFilter$,
  difficultyFilter$,
  memberFilter$,
  hideCompletedFilter$,
  hideIncompleteFilter$,
  hideMissingReqFilter$
]) as Observable<[string, QuestLength[], QuestDifficulty[], boolean | null, boolean, boolean, boolean]>;
export const filter$: Observable<QuestFilter> = filterSource$.pipe(
  map(([name, length, difficulty, member, hideComplete, hideIncomplete, hideMissingReq]): QuestFilter => {
    const out: QuestFilter = {} as any;
    if (name) {
      out.name = name;
    }
    if (length && length.length) {
      out.length = length;
    }
    if (difficulty && difficulty.length) {
      out.difficulty = difficulty;
    }
    if (typeof member === 'boolean') {
      out.members = member;
    }
    if (hideComplete) {
      out.hideCompleted = true;
    }
    if (hideIncomplete) {
      out.hideIncomplete = true;
    }
    if (hideMissingReq) {
      out.hideMissingReq = true;
    }

    return out;
  }),
  distinctUntilChanged(isEqual),
  shareReplay(1)
);

([
  [nameFilter$, StoreKey.NAME],
  [lengthFilter$, StoreKey.LENGTH_FILTER],
  [difficultyFilter$, StoreKey.DIFFICULTY_FILTER],
  [memberFilter$, StoreKey.MEMB_FILTER],
  [hideCompletedFilter$, StoreKey.HIDE_COMPLETED],
  [hideIncompleteFilter$, StoreKey.HIDE_INCOMPLETE],
  [hideMissingReqFilter$, StoreKey.HIDE_MISSING_REQUIREMENTS]
] as [Observable<any>, StoreKey][]).forEach(([o, key]) => {
  o.pipe(skip(1)).subscribe(v => {
    localStorage.setItem(key as StoreKey, JSON.stringify(v));
  });
});
