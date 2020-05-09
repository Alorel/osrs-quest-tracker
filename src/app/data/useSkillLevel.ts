import {useEffect, useState} from 'preact/hooks';
import {distinctUntilChanged, pluck, skip, startWith} from 'rxjs/operators';
import {Skill} from '../../questlist/Skill';
import {fullPlayerLevels$} from './player';

export function useSkillLevel(skill: Skill, defaultLevel = 1): number {
  const [value, setValue] = useState(defaultLevel);
  useEffect(() => {
    const sub = fullPlayerLevels$
      .pipe(
        pluck(skill),
        startWith(value),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
  }, [setValue, skill]);

  return value;
}
