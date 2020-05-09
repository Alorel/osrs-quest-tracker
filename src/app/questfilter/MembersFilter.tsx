import {h, VNode} from 'preact';
import {useCallback} from 'preact/hooks';
import {alignItemsFlexStart} from '../app.scss';
import {formControl, formGroup, mr1, mr2} from '../bs-partial.scss';
import {memberFilter$} from '../data/filter';
import {useFieldId} from '../util/useFieldId';
import {useBehaviorSubject} from '../util/useSubject';

export function MembersFilter(): VNode {
  const value = useBehaviorSubject(memberFilter$);
  const id = useFieldId('mf-');

  const onChange = useCallback((e: Event) => {
    const v = (e.target as HTMLSelectElement).value;
    memberFilter$.next(v === 'null' ? null : JSON.parse(v));
  }, []);

  return (
    <div class={`${formGroup} ${mr2} ${alignItemsFlexStart}`}>
      <label for={id} class={mr1}>Members: </label>
      <select id={id} onChange={onChange} class={formControl}>
        <option value={'null'} selected={value == null}>Both</option>
        <option value={'false'} selected={value === false}>Free only</option>
        <option value={'true'} selected={!!value}>Members only</option>
      </select>
    </div>
  );
}
