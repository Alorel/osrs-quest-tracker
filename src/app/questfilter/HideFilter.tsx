import {ComponentChildren, h, VNode} from 'preact';
import {useCallback} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {alignItemsFlexStart} from '../app.scss';
import {formGroup, listUnstyled, mr1} from '../bs-partial.scss';
import {hideCompletedFilter$, hideIncompleteFilter$, hideMissingReqFilter$} from '../data/filter';
import {LabeledCheckbox} from '../util/LabeledCheckbox';
import {useBehaviorSubject} from '../util/useSubject';
import {listFilter as containerCss} from './ListFilter.scss';

interface PropFilterProps {
  children: ComponentChildren;

  sbj: BehaviorSubject<any>
}

function PropFilter({sbj, children}: PropFilterProps): VNode {
  const value = useBehaviorSubject(sbj);
  const listener = useCallback((evt: Event) => {
    const checked = (evt.target as HTMLInputElement).checked;
    if (checked !== sbj.value) {
      sbj.next(checked);
    }
  }, [sbj]);

  return (
    <li>
      <LabeledCheckbox onChange={listener}
                       checked={value}>{children}</LabeledCheckbox>
    </li>
  );
}

export function HideFilter(): VNode {
  return (
    <div class={`${formGroup} ${alignItemsFlexStart}`}>
      <strong class={mr1}>Hide:</strong>
      <ul class={`${listUnstyled} ${containerCss}`}>
        <PropFilter sbj={hideIncompleteFilter$}>Incomplete quests</PropFilter>
        <PropFilter sbj={hideCompletedFilter$}>Completed quests</PropFilter>
        <PropFilter sbj={hideMissingReqFilter$}>Quests with missing requirements</PropFilter>
      </ul>
    </div>
  );
}
