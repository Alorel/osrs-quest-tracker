import {h, VNode} from 'preact';
import {Player} from './app/player/Player';
import {QuestFilter} from './app/questfilter/QuestFilter';
import {QuestTable} from './app/questlist/QuestTable';

export function App(): VNode {
  return (
    <div class={'container-fluid'}>
      <Player/>
      <QuestFilter/>
      <QuestTable/>
    </div>
  );
}
