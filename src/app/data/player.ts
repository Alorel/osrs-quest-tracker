import {round} from 'lodash-es';
import {combineLatest, Observable, of} from 'rxjs';
import {distinctUntilChanged, filter, map, pluck, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {Skill} from '../../questlist/Skill';
import {actualSkillIds} from '../SkillIcon';
import {isTruthy} from '../util/isTruthy';
import {fetchPlayer} from './fetchPlayer';
import {completedQuests$, profile$} from './profile';
import {rawQuests$} from './rawQuests';

export interface PlayerDetails {
  mode: string;

  name: string;

  skills: { [k: string]: number };
}

export type PlayerDetailsResponse = string | PlayerDetails;

export function isPlayerDetails(v: any): v is PlayerDetails {
  return !!v && typeof v.mode === 'string' && typeof v.name === 'string' &&
    typeof v.skills === 'object';
}

const playerName$: Observable<string> = profile$.pipe(
  pluck('name'),
  filter(isTruthy),
  distinctUntilChanged(),
  shareReplay(1)
);

const playerMode$: Observable<string> = profile$.pipe(
  pluck('mode'),
  filter(isTruthy),
  distinctUntilChanged(),
  shareReplay(1)
);

export const playerDetails$: Observable<PlayerDetailsResponse> = combineLatest([playerName$, playerMode$]).pipe(
  switchMap(([name, mode]) => fetchPlayer(name, mode)),
  shareReplay(1)
);

export const guaranteedPlayerDetails$: Observable<PlayerDetails> = playerDetails$.pipe(
  startWith(''),
  switchMap((r): Observable<PlayerDetails> => {
    if (typeof r === 'object') {
      return of(r);
    } else {
      const skills = Object.fromEntries(actualSkillIds.map(id => [id, id === Skill.HITPOINTS ? 10 : 1]));

      return combineLatest([playerName$, playerMode$]).pipe(
        map(([name, mode]) => ({name, mode, skills}))
      );
    }
  }),
  shareReplay(1)
);

export const combatLevel$: Observable<number> = guaranteedPlayerDetails$.pipe(
  map(({skills}): number => {
    const prayer = skills[Skill.PRAYER];
    const def = skills[Skill.DEFENCE];
    const hp = skills[Skill.HITPOINTS];

    const attack = skills[Skill.ATTACK];
    const str = skills[Skill.STRENGTH];

    const ranged = skills[Skill.RANGED];
    const mage = skills[Skill.MAGIC];

    const baseCb = (def + hp + Math.floor(prayer / 2)) / 4;
    const meleeCb = (attack + str) * 0.325;
    const rangedCb = Math.floor(3 * ranged / 2) * 0.325;
    const magicCb = Math.floor(3 * mage / 2) * 0.325;

    return round(baseCb + Math.max(meleeCb, rangedCb, magicCb), 2);
  }),
  startWith(3),
  distinctUntilChanged(),
  shareReplay(1)
);

export const qp$: Observable<number> = rawQuests$.pipe(
  switchMap((quests): Observable<number> => {
    function reducer(acc: number, questName: string): number {
      const quest = quests.find(q => q.name === questName);
      if (!quest) {
        console.error(`Unknown quest: ${questName}. Unable to fetch QP.`);

        return acc;
      }

      return acc + (quest.qp || 0);
    }

    return completedQuests$.pipe(
      map(completed => completed.length ? completed.reduce(reducer, 0) : 0)
    );
  }),
  startWith(0),
  distinctUntilChanged(),
  shareReplay(1)
);

const skills$ = guaranteedPlayerDetails$.pipe(pluck('skills'));
export const fullPlayerLevels$: Observable<{ [k: string]: number }> = combineLatest([skills$, combatLevel$, qp$])
  .pipe(
    map(([skills, combat, qp]) => ({
      ...skills,
      [Skill.COMBAT]: combat,
      [Skill.QP]: qp
    })),
    shareReplay(1)
  );

export const fetchInProgress$: Observable<boolean> = combineLatest([playerDetails$, playerName$, playerMode$])
  .pipe(
    map(([data, name, mode]): boolean => {
      if (typeof data === 'string') {
        return false;
      } else {
        return data.name !== name || data.mode !== mode;
      }
    }),
    startWith<boolean>(!!(profile$.value.name && profile$.value.mode)),
    distinctUntilChanged(),
    shareReplay(1)
  );


