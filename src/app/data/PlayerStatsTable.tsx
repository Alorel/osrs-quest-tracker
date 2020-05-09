import {staticComponent} from '@alorel/preact-static-component';
import {Fragment, h, VNode} from 'preact';
import {useContext} from 'preact/hooks';
import {ml2, mr2, table, tableBordered, tableSm, textCenter, textDanger} from '../bs-partial.scss';
import {FetchingNameContext} from '../player/NameFetchContext';
import {allSkillIds, SkillIcon} from '../SkillIcon';
import {useObservable} from '../util/useObservable';
import {fullPlayerLevels$, playerDetails$} from './player';

function ErrorDisplay(): VNode | null {
  const rawDetails = useObservable(playerDetails$);
  const fetching = useContext(FetchingNameContext);

  if (fetching || typeof rawDetails !== 'string') {
    return null;
  }

  return <span class={`${textDanger} ${mr2} ${ml2}`}>{rawDetails}</span>;
}

function StatsData(): VNode | null {
  const skills = useObservable(fullPlayerLevels$)!;

  if (!skills) {
    return null;
  }

  return (
    <Fragment>
      {allSkillIds.map(id => <td key={id}>{skills[id]}</td>)}
    </Fragment>
  );
}

export const PlayerStatsTable = staticComponent(function PlayerStatsTable(): VNode | null {
  return (
    <Fragment>
      <ErrorDisplay/>
      <table class={`${table} ${textCenter} ${tableSm} ${tableBordered}`}>
        <thead>
        <tr>{
          allSkillIds.map(i => <th scope={'col'} key={i}><SkillIcon skill={i}/></th>)
        }</tr>
        </thead>
        <tbody>
        <tr>
          <StatsData/>
        </tr>
        </tbody>
      </table>
    </Fragment>
  );
});
