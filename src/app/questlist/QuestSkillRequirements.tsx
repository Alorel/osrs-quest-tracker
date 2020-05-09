import {Fragment, h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {ILevelRequirement} from '../../questlist/ILevelRequirement';
import {IQuestRequirements} from '../../questlist/IQuestRequirements';
import {tableDanger, tableSuccess} from '../bs-partial.scss';
import {useSkillLevel} from '../data/useSkillLevel';
import {allSkillIds} from '../SkillIcon';

interface CellProps {
  req: ILevelRequirement;
}

function RequirementTd({req: {skill, level, boostable}}: CellProps): VNode {
  const currSkillLevel = useSkillLevel(skill);

  return (
    <td class={currSkillLevel >= level ? tableSuccess : tableDanger}>
      {boostable && <abbr title="Boostable">B </abbr>}
      <span>{level}</span>
    </td>
  );
}

interface RowProps {
  reqs: IQuestRequirements
}

export const QuestSkillRequirements = memo(function QuestSkillRequirements({reqs}: RowProps): VNode {
  if (!reqs.levels.length) {
    return <Fragment>{allSkillIds.map(i => <td key={i}/>)}</Fragment>;
  }

  return (
    <Fragment>{
      allSkillIds.map(id => {
        const req = reqs.levels.find(l => l.skill === id);
        if (!req) {
          return <td key={id}/>;
        }

        return <RequirementTd key={id} req={req}/>;
      })
    }</Fragment>
  );
});
