import {useEffect, useState} from 'preact/hooks';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, pluck, shareReplay, skip, startWith} from 'rxjs/operators';
import {IQuest} from '../../questlist/IQuest';
import {StoreKey} from '../StoreKey';

export interface Profile {
  completedQuests: string[];

  mode: string;

  name: string;
}

export const profile$: BehaviorSubject<Profile> = new BehaviorSubject<Profile>(((): Profile => {
  const str = localStorage.getItem(StoreKey.PROFILE);
  if (str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      localStorage.removeItem(StoreKey.PROFILE);
      console.error('Unable to parse stored profile', e);
    }
  }

  return {
    completedQuests: [],
    name: '',
    mode: 'normal'
  };
})());

profile$.pipe(skip(1)).subscribe(v => {
  localStorage.setItem(StoreKey.PROFILE, JSON.stringify(v));
});

export function useIsQuestCompleted(quest: IQuest): boolean {
  const completedQuests = useCompletedQuests();
  const [value, setValue] = useState(completedQuests.includes(quest.name));
  useEffect(() => {
    const newValue = completedQuests.includes(quest.name);
    setValue(newValue);
  }, [quest.name, completedQuests]);

  return value;
}

export function usePlayerName(): string {
  return usePlucked('name');
}

export function useProfileMode(): string {
  return usePlucked('mode');
}

export function useCompletedQuests(): string[] {
  return usePlucked('completedQuests');
}

function usePlucked<P extends keyof Profile>(key: P): Profile[P] {
  type V = Profile[P];
  const [value, setValue] = useState<V>(profile$.value[key]);

  useEffect(() => {
    const sub = profile$
      .pipe(
        pluck(key),
        startWith(value),
        distinctUntilChanged(),
        skip(1)
      )
      .subscribe(setValue);

    return () => {
      sub.unsubscribe();
    };
  }, []); // Shouldn't need deps here - only called internally

  return value;
}

export const completedQuests$: Observable<string[]> = profile$.pipe(
  pluck('completedQuests'),
  distinctUntilChanged(),
  shareReplay(1)
);
