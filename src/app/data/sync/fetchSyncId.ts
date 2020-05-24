import {isEqual, omitBy} from 'lodash-es';
import {Observable, PartialObserver, Subject} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {last, map} from 'rxjs/operators';
import {Profile, profile$} from '../profile';

function deleteRecord(syncId: string, recordId: string): void {
  ajax({
    method: 'DELETE',
    url: `https://jsonbox.io/${syncId}/${recordId}`
  }).subscribe(
    () => {
      console.debug('Old sync record', recordId, 'deleted');
    },
    (e: any) => {
      console.error('Error deleting old sync record', recordId, e);
    }
  );
}

export function fetchSyncId(syncId: string): Observable<Profile> {
  const req$ = ajax({
    headers: {
      'accept': 'application/json'
    },
    method: 'GET',
    url: `https://jsonbox.io/${syncId}`
  });

  return req$
    .pipe(
      last(),
      map((r): Profile => {
        const out: any = r.response;
        if (!Array.isArray(out)) {
          return out;
        } else {
          if (out.length > 1) {
            out.slice(1).forEach(r => {
              deleteRecord(syncId, r._id);
            });
          }

          return out[0];
        }
      }),
      map((v: any): Profile => omitBy(v, (_value: any, key: string) => key.startsWith('_')) as any)
    );
}

export const onPlayerSynced$ = new Subject<Profile>();

export const onSyncFetched: Readonly<PartialObserver<Profile>> = Object.freeze({
  error: (e: any) => {
    console.error('Sync get error', e);
  },
  next: r => {
    if (!isEqual(r, profile$.value)) {
      profile$.next(r);
      onPlayerSynced$.next(r);
    }
  }
});
