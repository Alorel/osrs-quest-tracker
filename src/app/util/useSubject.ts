import {useEffect, useState} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {skip} from 'rxjs/operators';

export function useBehaviorSubject<T>(sbj: BehaviorSubject<T>): T {
  const [value, setValue] = useState<T>(sbj.value);
  useEffect(() => {
    const sub = sbj
      .pipe(skip(1))
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
  }, [sbj]);

  return value;
}

export {useObservable as useSubject} from './useObservable';
