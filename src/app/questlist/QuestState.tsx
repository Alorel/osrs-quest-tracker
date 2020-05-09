import {IQuest} from '../../questlist/IQuest';
import {tableDanger, tableSuccess} from '../bs-partial.scss';
import {useIsQuestCompleted} from '../data/profile';

export const enum QuestState {
  COMPLETE,
  LVL_LOW,
  INCOMPLETE
}

export function useQuestState(quest: IQuest, complete: boolean = useIsQuestCompleted(quest)): QuestState {
  return complete ? QuestState.COMPLETE : QuestState.INCOMPLETE;
}

export function questStateToRowClass(state: QuestState): string {
  switch (state) {
    case QuestState.COMPLETE:
      return tableSuccess;
    case QuestState.LVL_LOW:
      return tableDanger;
    default:
      return '';
  }
}
