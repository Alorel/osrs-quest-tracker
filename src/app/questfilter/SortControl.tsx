import {Fragment, h, VNode} from 'preact';
import {sort$} from '../data/sort';
import {BehaviorSubjectSelect} from '../layout/BehaviorSubjectSelect';

export function SortControl(): VNode {
  return (
    <BehaviorSubjectSelect sbj={sort$} renderOpts={value => (
      <Fragment>
        <option value={'null'} selected={value == null}>Name</option>
        <option value={'"members"'} selected={value === 'members'}>Free/Members</option>
        <option value={'"length"'} selected={value === 'length'}>Length</option>
        <option value={'"difficulty"'} selected={value === 'difficulty'}>Difficulty</option>
      </Fragment>
    )}>Sort:</BehaviorSubjectSelect>
  );
}
