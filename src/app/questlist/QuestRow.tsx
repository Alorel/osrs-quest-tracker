import {h, VNode} from 'preact';
import {memo} from 'preact/compat';
import {IQuest} from '../../questlist/IQuest';
import {tableDanger, tableSuccess} from '../bs-partial.scss';
import {useCompletedQuests, useIsQuestCompleted} from '../data/profile';
import {RsIcon} from '../RsIcon';
import {QuestDifficultyDisplay} from './QuestDifficultyDisplay';
import {QuestLengthDisplay} from './QuestLengthDisplay';
import {QuestLink} from './QuestLink';
import {QuestSkillRequirements} from './QuestSkillRequirements';
import {questStateToRowClass, useQuestState} from './QuestState';
import {QuestStateTd} from './QuestStateTd';

interface QuestProp {
  quest: IQuest;
}

function RequirementsQuestTd({quest}: QuestProp): VNode {
  const completedQuests = useCompletedQuests();
  const hasAllCompleted = !quest.requirements.quests.some(q => !completedQuests.includes(q));

  return (
    <td class={hasAllCompleted ? tableSuccess : tableDanger}>
      <QuestLink quest={quest}/>
    </td>
  );
}

function QuestNameTd({quest}: QuestProp): VNode {
  if (!quest.requirements.quests.length) {
    return <td><QuestLink quest={quest}/></td>;
  }

  return <RequirementsQuestTd quest={quest}/>;
}

export const QuestRow = memo(function QuestRow({quest}: QuestProp): VNode {
  const questComplete = useIsQuestCompleted(quest);
  const questState = useQuestState(quest, questComplete);

  return (
    <tr class={questStateToRowClass(questState)}>
      <QuestStateTd complete={questComplete} quest={quest}/>
      <td><RsIcon icon={quest.members ? 'members' : 'free'}/></td>
      <QuestNameTd quest={quest}/>
      <td><QuestLengthDisplay length={quest.length}/></td>
      <td><QuestDifficultyDisplay difficulty={quest.difficulty}/></td>
      <QuestSkillRequirements reqs={quest.requirements}/>
    </tr>
  );
});
