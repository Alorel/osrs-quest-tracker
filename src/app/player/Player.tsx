import {h, VNode} from 'preact';
import {colAuto, invisible, pl1, pr1, row as rowCss} from '../bs-partial.scss';
import {DataExport} from '../data/migration/DataExport';
import {DataImport} from '../data/migration/DataImport';
import {fetchInProgress$} from '../data/player';
import {PlayerStatsTable} from '../data/PlayerStatsTable';
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
        <div class={stdColClass}>
          <DataImport/>
        </div>
        <div class={colAuto}>
          <DataExport/>
        </div>
      </div>
    </FetchingNameContext.Provider>
  );
}
