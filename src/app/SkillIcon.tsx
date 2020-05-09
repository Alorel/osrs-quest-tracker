import {h, VNode} from 'preact';
import {Skill} from '../questlist/Skill';
import {RsIcon} from './RsIcon';

const map: { [skill: string]: string } = {
  [Skill.COMBAT]: 'combat',
  [Skill.ATTACK]: 'attack',
  [Skill.AGILITY]: 'agility',
  [Skill.CONSTRUCTION]: 'construction',
  [Skill.COOKING]: 'cooking',
  [Skill.DEFENCE]: 'defence',
  [Skill.FARMING]: 'farming',
  [Skill.FIREMAKING]: 'firemaking',
  [Skill.FISHING]: 'fishing',
  [Skill.FLETCHING]: 'fletching',
  [Skill.RANGED]: 'ranged',
  [Skill.THIEVING]: 'thieving',
  [Skill.CRAFTING]: 'crafting',
  [Skill.HERBLORE]: 'herblore',
  [Skill.HITPOINTS]: 'hp',
  [Skill.HUNTER]: 'hunter',
  [Skill.MAGIC]: 'magic',
  [Skill.MINING]: 'mining',
  [Skill.PRAYER]: 'prayer',
  [Skill.QP]: 'quest',
  [Skill.RUNECRAFTING]: 'runecrafting',
  [Skill.SLAYER]: 'slayer',
  [Skill.SMITHING]: 'smithing',
  [Skill.STRENGTH]: 'strength',
  [Skill.WOODCUTTING]: 'woodcutting'
};

interface Props {
  skill: Skill;
}

/** Ordered in the same way the API returns */
export const actualSkillIds: Skill[] = [
  Skill.ATTACK,
  Skill.DEFENCE,
  Skill.STRENGTH,
  Skill.HITPOINTS,
  Skill.RANGED,
  Skill.PRAYER,
  Skill.MAGIC,
  Skill.COOKING,
  Skill.WOODCUTTING,
  Skill.FLETCHING,
  Skill.FISHING,
  Skill.FIREMAKING,
  Skill.CRAFTING,
  Skill.SMITHING,
  Skill.MINING,
  Skill.HERBLORE,
  Skill.AGILITY,
  Skill.THIEVING,
  Skill.SLAYER,
  Skill.FARMING,
  Skill.RUNECRAFTING,
  Skill.HUNTER,
  Skill.CONSTRUCTION
];

export const allSkillIds: Skill[] = actualSkillIds.concat(
  Skill.QP,
  Skill.COMBAT
);

export function SkillIcon({skill}: Props): VNode {
  if (!map[skill]) {
    throw new Error(`Unknown skill: ${skill}`);
  }

  return <RsIcon icon={map[skill]}/>;
}
