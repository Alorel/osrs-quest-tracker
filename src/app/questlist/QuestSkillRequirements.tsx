import {Fragment, h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {ILevelRequirement} from '../../questlist/ILevelRequirement';
import {IQuestRequirements} from '../../questlist/IQuestRequirements';
import {nowrap} from '../app.scss';
import {tableDanger, tableSuccess} from '../bs-partial.scss';
import {useSkillLevel} from '../data/useSkillLevel';
import {allSkillIds} from '../SkillIcon';

interface CellProps {
  req: ILevelRequirement;
}

function RequirementTd({req: {skill, level, boostable}}: CellProps): VNode {
  const currSkillLevel = useSkillLevel(skill);
  const classes: string[] = [currSkillLevel >= level ? tableSuccess : tableDanger];
  if (boostable) {
    classes.push(nowrap);
  }

  return (
    <td class={classes.join(' ')}>
      {
        boostable ? (
            <Fragment>
              <abbr title="Boostable">B </abbr>
              <span>{level}</span>
            </Fragment>
          ) :
          level
      }
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
