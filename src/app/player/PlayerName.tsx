import {capitalize} from 'lodash-es';
import {h, VNode} from 'preact';
import {useCallback, useContext, useState} from 'preact/hooks';
import {btn, btnLight, formControl, formGroup, formInline, mr1} from '../bs-partial.scss';
import {profile$} from '../data/profile';
import {FetchingNameContext} from './NameFetchContext';
import {urlMode} from './urlMode';

interface MiniControl {
  value: string;

  onChange(v: string): void;
}

function ModeSelect({onChange, value}: MiniControl): VNode {
  const changeListener = useCallback((e: Event) => {
    onChange((e.target as HTMLSelectElement).value);
  }, [onChange]);

  return (
    <select onChange={changeListener} class={`${formControl} ${mr1}`}>{
      Object.keys(urlMode)
        .map(k => <option value={k} key={k} selected={value === k}>{capitalize(k)}</option>)
    }</select>
  );
}

export function PlayerName(): VNode {
  const fetching: boolean = useContext(FetchingNameContext);
  const [name, setName] = useState(profile$.value.name);
  const [mode, setMode] = useState(profile$.value.mode);

  const onModeChange = useCallback((v: string) => {
    setMode(v);
  }, [setMode]);

  const onNameInput = useCallback((e: Event) => {
    setName((e.target as HTMLInputElement).value);
  }, [setName]);

  const onSubmit = useCallback((e: Event) => {
    e.preventDefault();
    profile$.next({
      ...profile$.value,
      name,
      mode
    });
  }, [name, mode]);

  return (
    <form class={formInline} onSubmit={onSubmit}>
      <div class={formGroup}>
        <input type={'text'}
               autocomplete={'off'}
               onInput={onNameInput}
               placeholder={'Character name'}
               aria-label={'Character name'}
               value={name}
               class={`${formControl} ${mr1}`}/>
      </div>
      <div class={formGroup}>
        <ModeSelect value={mode} onChange={onModeChange}/>
      </div>
      <div class={formGroup}>
        <button
          type={'submit'}
          class={`${btn} ${btnLight}`}
          disabled={fetching || !name || !mode}
        >
          Fetch
        </button>
      </div>
    </form>
  );
}
