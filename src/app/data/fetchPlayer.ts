import {Observable, of} from 'rxjs';
import {ajax, AjaxError} from 'rxjs/ajax';
import {catchError, distinctUntilChanged, filter, last, map, shareReplay, startWith} from 'rxjs/operators';
import {Skill} from '../../questlist/Skill';
import {urlMode} from '../player/urlMode';
import {actualSkillIds} from '../SkillIcon';
import {isTruthy} from '../util/isTruthy';
import {PlayerDetails, PlayerDetailsResponse} from './player';

const cache: { [k: string]: Observable<PlayerDetailsResponse> } = {};

function getLineLevel(line: string): number {
  return parseInt(line.split(/,/g)[1]);
}

export function fetchPlayer(name: string, mode: string): Observable<PlayerDetailsResponse> {
  const cacheKey = `${name}|${mode}`;
  const url = `/.netlify/functions/get-toon?basepath=hiscore_${urlMode[mode]}&toon=${name}`;

  if (!cache[cacheKey]) {
    cache[cacheKey] = ajax({url, responseType: 'text'}).pipe(
      last(),
      map((rsp): string => {
        const out = (rsp.response as string).trim();
        try {
          localStorage.setItem(cacheKey, out);
        } catch (e) {
          console.warn(e);
        }

        return out;
      }),
      startWith(localStorage.getItem(cacheKey) || ''),
      distinctUntilChanged(),
      filter(isTruthy),
      map((text): PlayerDetails => {
        const lines = text.split(/\n/g);

        const skills: [Skill, number][] = actualSkillIds
          .map((skill, index) => [skill, getLineLevel(lines[index + 1])]);

        return {
          name,
          mode,
          skills: Object.fromEntries(skills)
        };
      }),
      catchError((e: AjaxError): Observable<any> => {
        console.error(e);
        delete cache[cacheKey];

        return of(e.message);
      }),
      shareReplay(1)
    );
  }

  return cache[cacheKey];
}
