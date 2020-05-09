import {intersection, isEmpty} from 'lodash-es';
import {combineLatest, Observable, of} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {IQuest} from '../../questlist/IQuest';
import {filter$} from './filter';
import {fullPlayerLevels$} from './player';
import {completedQuests$} from './profile';
import {rawQuests$} from './rawQuests';

export const filteredQuests$: Observable<IQuest[]> = rawQuests$.pipe(
  switchMap((raw): Observable<IQuest[]> => {
    return filter$.pipe(
      switchMap((filter): Observable<IQuest[]> => {
        if (isEmpty(filter)) {
          return of(raw);
        }

        let out: IQuest[] = raw;

        if (filter.name) {
          const lc = filter.name.toLowerCase();
          out = out.filter(q => q.name.toLowerCase().includes(lc));
        }

        if (filter.members === true) {
          out = out.filter(q => q.members === true);
        } else if (filter.members === false) {
          out = out.filter(q => q.members !== true);
        }

        if (filter.length) {
          out = out.filter(q => {
            if (Array.isArray(q.length)) {
              return !!intersection(q.length, filter.length!).length;
            } else {
              return filter.length!.includes(q.length);
            }
          });
        }

        if (filter.difficulty) {
          out = out.filter(q => filter.difficulty!.includes(q.difficulty));
        }

        let out$: Observable<IQuest[]> = of(out);
        if (filter.hideIncomplete || filter.hideCompleted) {
          out$ = out$.pipe(
            switchMap(o => {
              return completedQuests$.pipe(
                map(completedQs => {
                  let ret = o;
                  if (filter.hideCompleted) {
                    ret = ret.filter(q => !completedQs.includes(q.name));
                  }
                  if (filter.hideIncomplete) {
                    ret = ret.filter(q => completedQs.includes(q.name));
                  }

                  return ret;
                })
              );
            })
          );
        }

        if (filter.hideMissingReq) {
          out$ = out$.pipe(
            switchMap(o => {
              return combineLatest([completedQuests$, fullPlayerLevels$]).pipe(
                map(([completedQs, liveLevels]): IQuest[] => {
                  return o.filter(({requirements: {quests: requiredQs, levels: requiredLvls}}): boolean => {
                    if (requiredLvls.length && requiredLvls.some(l => l.level > liveLevels[l.skill])) {
                      return false;
                    }
                    // noinspection RedundantIfStatementJS
                    if (requiredQs.length && requiredQs.some(q => !completedQs.includes(q))) {
                      return false;
                    }

                    return true;
                  });
                })
              );
            })
          );
        }

        return out$;
      })
    );
  }),
  shareReplay(1)
);
