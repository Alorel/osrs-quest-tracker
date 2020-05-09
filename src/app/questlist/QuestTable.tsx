import {h, VNode} from 'preact';
import {Skill} from '../../questlist/Skill';
import {fullwidth, minTdWidth, nowrap} from '../app.scss';
import {table as tableCss, tableBordered, tableHover, tableResponsive, tableSm, textCenter} from '../bs-partial.scss';
import {allSkillIds, SkillIcon} from '../SkillIcon';
import {QuestRows} from './QuestRows';

export function QuestTable(): VNode {
  return (
    <div class={tableResponsive}>
      <table class={`${tableCss} ${textCenter} ${tableHover} ${tableSm} ${tableBordered} ${nowrap}`}>
        <thead>
        <tr>
          <th scope="col"/>
          <th scope="col">Members</th>
          <th scope="col" class={fullwidth}>Quest</th>
          <th scope="col">Length</th>
          <th scope="col">Difficulty</th>
          {allSkillIds.map(i => <th scope="col" key={i}><SkillIcon skill={i as Skill}/></th>)}
        </tr>
        </thead>
        <tbody class={minTdWidth}>
        <QuestRows/>
        </tbody>
      </table>
    </div>
  );
}
