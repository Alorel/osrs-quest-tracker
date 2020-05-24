import {h, VNode} from 'preact';
import {colAuto, invisible, pl1, pr1, row as rowCss} from '../bs-partial.scss';
import {fetchInProgress$} from '../data/player';
import {PlayerStatsTable} from '../data/PlayerStatsTable';
import {DataSync} from '../data/sync/DataSync';
import {Spinner} from '../layout/spinner/Spinner';
import {useObservable} from '../util/useObservable';
import {FetchingNameContext} from './NameFetchContext';
import {PlayerName} from './PlayerName';

export function Player(): VNode {
  const fetching = useObservable(fetchInProgress$, false);
  let spinnerClass = `${colAuto} ${pl1}`;
  if (!fetching) {
    spinnerClass += ` ${invisible}`;
  }

  const stdColClass = `${colAuto} ${pr1}`;

  return (
    <FetchingNameContext.Provider value={fetching}>
      <h1>Player</h1>
      <div class={rowCss}>
        <div class={stdColClass}>
          <PlayerName/>
        </div>
        <div class={spinnerClass}>
          <Spinner/>
        </div>
        <div class={stdColClass}>
          <PlayerStatsTable/>
        </div>
        <div class={colAuto}>
          <DataSync/>
        </div>
      </div>
    </FetchingNameContext.Provider>
  );
}
