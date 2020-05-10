import {Fragment, h, VNode} from 'preact';
import {IQuest} from '../../questlist/IQuest';
import {sortedQuests$} from '../data/sortedQuests';
import {useObservable} from '../util/useObservable';
import {QuestRow} from './QuestRow';

export function QuestRows(): VNode | null {
  const quests = useObservable<IQuest[], IQuest[]>(sortedQuests$, []);

  if (!quests.length) {
    return null;
  }

  return <Fragment>{quests.map(q => <QuestRow quest={q} key={q.slug}/>)}</Fragment>;
}
