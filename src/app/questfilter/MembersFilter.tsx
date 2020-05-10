import {Fragment, h, VNode} from 'preact';
import {memberFilter$} from '../data/filter';
import {BehaviorSubjectSelect} from '../layout/BehaviorSubjectSelect';

export function MembersFilter(): VNode {
  return (
    <BehaviorSubjectSelect sbj={memberFilter$} renderOpts={value => (
      <Fragment>
        <option value={'null'} selected={value == null}>Both</option>
        <option value={'false'} selected={value === false}>Free only</option>
        <option value={'true'} selected={!!value}>Members only</option>
      </Fragment>
    )}>Members:</BehaviorSubjectSelect>
  );
}
