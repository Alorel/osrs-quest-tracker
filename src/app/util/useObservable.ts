import {useEffect, useState} from 'preact/hooks';
import {Observable} from 'rxjs';
import {distinctUntilChanged, skip, startWith} from 'rxjs/operators';

export function useObservable<T, I>(ob: Observable<T>, initialValue: I): T | I;
export function useObservable<T>(ob: Observable<T>): T | null;
export function useObservable<T, I>(ob: Observable<T>, initialValue: I = null as any): T | I | null {
  const [value, setValue] = useState<T | I>(initialValue);

  useEffect(() => {
    const sub = ob
      .pipe(
        startWith(initialValue as any as T),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
  }, [ob]);

  return value;
}
