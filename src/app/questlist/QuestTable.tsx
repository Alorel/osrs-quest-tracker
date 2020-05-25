import {h, VNode} from 'preact';
import {Skill} from '../../questlist/Skill';
import {fullwidth, minTdWidth, qTable} from '../app.scss';
import {table as tableCss, tableBordered, tableStriped, tableHover, tableResponsive, tableSm, textCenter} from '../bs-partial.scss';
import {useHasMembersFilter} from '../data/useHasMembersFilter';
import {allSkillIds, SkillIcon} from '../SkillIcon';
import {QuestRows} from './QuestRows';

function MembersCol(): VNode | null {
  const hasMemberFilter = useHasMembersFilter();

  return hasMemberFilter ?
    <th scope="col">Members</th> :
    null;
}

export function QuestTable(): VNode {
  return (
    <div class={tableResponsive}>
      <table class={`${tableCss} ${tableStriped} ${qTable} ${textCenter} ${tableHover} ${tableSm} ${tableBordered}`}>
        <thead>
        <tr>
          <th scope="col"/>
          <MembersCol/>
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
