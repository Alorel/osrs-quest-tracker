import {Observable, of} from 'rxjs';
import {ajax, AjaxError} from 'rxjs/ajax';
import {catchError, last, map, shareReplay} from 'rxjs/operators';
import {Skill} from '../../questlist/Skill';
import {urlMode} from '../player/urlMode';
import {actualSkillIds} from '../SkillIcon';
import {buildCorsUrl} from '../util/buildCorsUrl';
import {PlayerDetails, PlayerDetailsResponse} from './player';

const cache: { [k: string]: Observable<PlayerDetailsResponse> } = {};

function getLineLevel(line: string): number {
  return parseInt(line.split(/,/g)[1]);
}

export function fetchPlayer(name: string, mode: string): Observable<PlayerDetailsResponse> {
  const cacheKey = `${name}|${mode}`;
  const url = `https://secure.runescape.com/m=hiscore_${urlMode[mode]}/index_lite.ws?player=${name}`;

  if (!cache[cacheKey]) {
    cache[cacheKey] = ajax({url: buildCorsUrl(url), responseType: 'text'}).pipe(
      last(),
      map((rsp): PlayerDetails => {
        const text: string = rsp.response as string;
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
