import {Fragment, h, VNode} from 'preact';
import {QuestDifficulty} from '../../questlist/QuestDifficulty';

interface Props {
  difficulty: QuestDifficulty;
}

export const difficultyEntries: [QuestDifficulty, string][] = [
  [QuestDifficulty.SPECIAL, 'Special'],
  [QuestDifficulty.NOVICE, 'Novice'],
  [QuestDifficulty.INTERMEDIATE, 'Intermediate'],
  [QuestDifficulty.EXPERIENCED, 'Experienced'],
  [QuestDifficulty.MASTER, 'Master'],
  [QuestDifficulty.GRANDMASTER, 'Grandmaster']
];

const map = Object.fromEntries(difficultyEntries);

export function stringifyQuestDifficulty(length: QuestDifficulty): string {
  if (!map[length]) {
    throw new Error(`Unknown quest difficulty: ${length}`);
  }

  return map[length];
}

export function QuestDifficultyDisplay(props: Props): VNode {
  return <Fragment>{stringifyQuestDifficulty(props.difficulty)}</Fragment>;
}
