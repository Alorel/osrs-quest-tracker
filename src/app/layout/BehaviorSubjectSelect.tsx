import {ComponentChildren, h, VNode} from 'preact';
import {useCallback} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {alignItemsFlexStart} from '../app.scss';
import {formControl, formGroup, mr1, mr2} from '../bs-partial.scss';
import {useFieldId} from '../util/useFieldId';
import {useBehaviorSubject} from '../util/useSubject';

interface Props<T> {
  children: ComponentChildren;

  sbj: BehaviorSubject<T>;

  renderOpts(value: T): ComponentChildren;
}

export function BehaviorSubjectSelect<T>({sbj, children, renderOpts}: Props<T>): VNode {
  const value = useBehaviorSubject(sbj);
  const id = useFieldId('sel-');

  const onChange = useCallback((e: Event) => {
    sbj.next(JSON.parse((e.target as HTMLSelectElement).value));
  }, [sbj]);

  return (
    <div class={`${formGroup} ${mr2} ${alignItemsFlexStart}`}>
      <label for={id} class={mr1}>{children}</label>
      <select id={id} onChange={onChange} class={formControl}>
        {renderOpts(value)}
      </select>
    </div>
  );
}
