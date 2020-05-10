import {h, VNode} from 'preact';
import {vanityStamp} from './app/app.scss';
import {containerFluid, mr1} from './app/bs-partial.scss';
import {Player} from './app/player/Player';
import {QuestFilter} from './app/questfilter/QuestFilter';
import {QuestTable} from './app/questlist/QuestTable';

const enum Conf {
  AUTHOR = 'Iron Thrills'
}

export function App(): VNode {
  return (
    <div class={containerFluid}>
      <Player/>
      <QuestFilter/>
      <QuestTable/>
      <div class={vanityStamp}>
        <span class={mr1}>Created with ♥ by</span>
        <a target={'blank'}
           rel={'noopener'}
           href={`https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/hiscorepersonal?user1=${encodeURIComponent(Conf.AUTHOR)}`}>
          {Conf.AUTHOR}
        </a>
      </div>
    </div>
  );
}
