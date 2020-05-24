import {isEqual} from 'lodash-es';
import {EMPTY, merge, Observable, Subject} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {catchError, distinctUntilChanged, skip, switchMap, switchMapTo, take} from 'rxjs/operators';
import {Profile, profile$} from '../profile';
import {fetchSyncId, onSyncFetched} from './fetchSyncId';
import {syncId$} from './syncId';

export const forceProfileSync$ = new Subject<any>();

const syncProfileNatural$: Observable<Profile> = profile$.pipe(
  skip(syncId$.value ? 1 : 0),
  distinctUntilChanged(isEqual)
);
const syncProfileForced$: Observable<Profile> = forceProfileSync$.pipe(
  switchMapTo(profile$.pipe(take(1)))
);

merge(syncProfileForced$, syncProfileNatural$)
  .pipe(
    switchMap(profile => {
      const syncId = syncId$.value;
      if (!syncId) {
        return EMPTY;
      }

      return ajax({
        body: JSON.stringify(profile),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
        url: `https://jsonbox.io/${syncId}`
      }).pipe(
        catchError((e: any) => {
          console.error(e);

          return EMPTY;
        })
      );
    })
  )
  .subscribe((rsp: any) => {
    console.debug('Sync response:', rsp);
  });

if (syncId$.value) {
  fetchSyncId(syncId$.value)
    .subscribe(onSyncFetched);
}
