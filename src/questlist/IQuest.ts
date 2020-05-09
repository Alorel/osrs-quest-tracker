import {IQuestRequirements} from './IQuestRequirements';
import {QuestDifficulty} from './QuestDifficulty';
import {QuestLength} from './QuestLength';

export interface IQuest {
  difficulty: QuestDifficulty;

  length: QuestLength | QuestLength[];

  members?: true;

  name: string;

  qp: number;

  requirements: IQuestRequirements;

  slug: string;
}
