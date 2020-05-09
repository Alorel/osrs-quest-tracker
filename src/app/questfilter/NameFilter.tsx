import {h, VNode} from 'preact';
import {useCallback} from 'preact/hooks';
import {alignItemsFlexStart} from '../app.scss';
import {formControl, formGroup, mr1, mr2} from '../bs-partial.scss';
import {nameFilter$} from '../data/filter';
import {useFieldId} from '../util/useFieldId';
import {useBehaviorSubject} from '../util/useSubject';

export function NameFilter(): VNode {
  const value = useBehaviorSubject(nameFilter$);
  const id = useFieldId('nf-');

  const onChange = useCallback((e: Event) => {
    nameFilter$.next((e.target as HTMLSelectElement).value || null);
  }, []);

  return (
    <div class={`${formGroup} ${mr2} ${alignItemsFlexStart}`}>
      <label for={id} class={mr1}>Name:</label>
      <input autocomplete={'off'} id={id} onInput={onChange} class={formControl} value={value || ''}/>
    </div>
  );
}
