import {h, VNode} from 'preact';
import {useCallback, useRef} from 'preact/hooks';
import {IQuest} from '../../questlist/IQuest';
import {profile$} from '../data/profile';
import {useEventListener} from '../util/useEventListener';

interface TdProps {
  complete: boolean;

  quest: IQuest;
}

const LISTENER_OPTS = {capture: true, passive: true};

export function QuestStateTd({quest: {name}, complete}: TdProps): VNode {
  const tdRef = useRef<HTMLTableCellElement>();
  const callback = useCallback(() => {
    const willBeCompleted = !complete;
    const profile = profile$.value;
    const completedQuests = profile.completedQuests;

    if (willBeCompleted) {
      if (!completedQuests.includes(name)) {
        profile$.next({
          ...profile,
          completedQuests: completedQuests.concat(name)
        });
      }
    } else {
      const idx = completedQuests.indexOf(name);
      if (idx !== -1) {
        const cloned = completedQuests.slice();
        cloned.splice(idx, 1);
        profile$.next({
          ...profile,
          completedQuests: cloned
        });
      }
    }
  }, [name, complete]);
  useEventListener(tdRef, 'click', callback, LISTENER_OPTS);

  return (
    <td ref={tdRef}>
      <input type="checkbox" checked={complete}/>
    </td>
  );
}
