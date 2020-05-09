import {h, VNode} from 'preact';
import {IQuest} from '../../questlist/IQuest';

interface Props {
  quest: IQuest;
}

export function QuestLink({quest: {requirements, slug, name}}: Props): VNode {
  const prereqs = requirements.quests;

  return (
    <a target="_blank"
       href={`https://oldschool.runescape.wiki/w/${slug}`}
       rel="noopener">
      {prereqs.length ? <abbr title={`Requires: ${prereqs.join(', ')}`}>{name}</abbr> : name}
    </a>
  );
}
