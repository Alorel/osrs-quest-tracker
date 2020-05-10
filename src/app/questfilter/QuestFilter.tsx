import {Fragment, h, VNode} from 'preact';
import {alignItemsFlexStart} from '../app.scss';
import {formInline} from '../bs-partial.scss';
import {HideFilter} from './HideFilter';
import {DifficultyFilter, LengthFilter} from './LengthDifficultyFilter';
import {MembersFilter} from './MembersFilter';
import {NameFilter} from './NameFilter';
import {SortControl} from './SortControl';

export function QuestFilter(): VNode {
  return (
    <Fragment>
      <h1>Filter</h1>
      <div class={`${formInline} ${alignItemsFlexStart}`}>
        <MembersFilter/>
        <LengthFilter/>
        <DifficultyFilter/>
        <NameFilter/>
        <HideFilter/>
        <SortControl/>
      </div>
    </Fragment>
  );
}
