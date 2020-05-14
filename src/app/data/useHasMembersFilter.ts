import {useEffect, useState} from 'preact/hooks';
import {distinctUntilChanged, map, skip, startWith} from 'rxjs/operators';
import {memberFilter$} from './filter';

function isNotNull(v: any): boolean {
  return v != null;
}

export function useHasMembersFilter(): boolean {
  const [value, setValue] = useState<boolean>(memberFilter$.value != null);
  useEffect(() => {
    const sub = memberFilter$
      .pipe(
        map(isNotNull),
        startWith(value),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return value;
}
