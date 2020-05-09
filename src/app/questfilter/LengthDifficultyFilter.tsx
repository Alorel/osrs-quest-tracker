import {ComponentChildren, h, VNode} from 'preact';
import {useCallback} from 'preact/hooks';
import {BehaviorSubject} from 'rxjs';
import {alignItemsFlexStart} from '../app.scss';
import {formGroup, mr1, mr2} from '../bs-partial.scss';
import {difficultyFilter$, lengthFilter$} from '../data/filter';
import {difficultyEntries} from '../questlist/QuestDifficultyDisplay';
import {lengthEntries} from '../questlist/QuestLengthDisplay';
import {useBehaviorSubject} from '../util/useSubject';
import {ListFilter} from './ListFilter';

interface CommonProps {
  children: ComponentChildren;

  entries: [any, string][];

  subject: BehaviorSubject<any>;
}

function CommonFilter({entries, children, subject}: CommonProps): VNode {
  const onChange = useCallback((v: any) => {
    subject.next(v);
  }, [subject]);
  const value = useBehaviorSubject(subject);

  return (
    <div class={`${formGroup} ${mr2} ${alignItemsFlexStart}`}>
      <strong class={mr1}>{children}</strong>
      <ListFilter options={entries} value={value} onChange={onChange}/>
    </div>
  );
}

export function LengthFilter(): VNode {
  return <CommonFilter entries={lengthEntries} subject={lengthFilter$}>Length: </CommonFilter>;
}

export function DifficultyFilter(): VNode {
  return <CommonFilter entries={difficultyEntries} subject={difficultyFilter$}>Difficulty: </CommonFilter>;
}
