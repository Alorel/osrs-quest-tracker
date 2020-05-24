import {useEffect, useState} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {distinctUntilChanged, skip, startWith} from 'rxjs/operators';

const enum Storage {
  SYNC_KEY = 'profile-sync-id'
}

export const syncId$ = new BehaviorSubject<string>(localStorage.getItem(Storage.SYNC_KEY) || '');

syncId$.subscribe(v => {
  if (!v) {
    localStorage.removeItem(Storage.SYNC_KEY);
  } else {
    localStorage.setItem(Storage.SYNC_KEY, v);
  }
});

function setSyncId(v: string): void {
  if (v !== syncId$.value) {
    syncId$.next(v);
  }
}

export function useSyncId(): [string, (v: string) => void] {
  const [value, setValue] = useState(syncId$.value);
  useEffect(() => {
    const sub = syncId$
      .pipe(
        startWith(value),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
  }, [setValue]);

  return [value, setSyncId];
}
