import {h, Fragment, VNode} from 'preact';
import {QuestLength} from '../../questlist/QuestLength';

interface Props {
  length: QuestLength | QuestLength[];
}

export const lengthEntries: [QuestLength, string][] = [
  [QuestLength.VSHORT, 'V. short'],
  [QuestLength.SHORT, 'Short'],
  [QuestLength.MEDIUM, 'Medium'],
  [QuestLength.LONG, 'Long'],
  [QuestLength.VLONG, 'V. long']
];

const lengthMap = Object.fromEntries(lengthEntries);

export function stringifyQuestLength(length: QuestLength | QuestLength[]): string {
  if (Array.isArray(length)) {
    return length.map(stringifyQuestLength).join('\u00A0-\u00A0'); // &nbsp;
  }

  if (!lengthMap[length]) {
    throw new Error(`Unknown quest length: ${length}`);
  }

  return lengthMap[length];
}

export function QuestLengthDisplay(props: Props): VNode {
  return <Fragment>{stringifyQuestLength(props.length)}</Fragment>;
}
