import * as fs from 'fs';
import {QuestDifficulty} from './src/questlist/QuestDifficulty';
import {QuestLength} from './src/questlist/QuestLength';
import {Skill} from './src/questlist/Skill';

const raw = require('./rawdata.json');

function mapDifficulty(diff: string): QuestDifficulty {
  switch (diff) {
    case 'Novice':
      return QuestDifficulty.NOVICE;
    case 'Intermediate':
      return QuestDifficulty.INTERMEDIATE;
    case 'Experienced':
      return QuestDifficulty.EXPERIENCED;
    case 'Master':
      return QuestDifficulty.MASTER;
    case 'Grandmaster':
      return QuestDifficulty.GRANDMASTER;
    case 'Special':
      return QuestDifficulty.SPECIAL;
    default:
      throw new Error(`Unknown difficulty: ${diff}`);
  }
}

function mapLength(l: string): QuestLength | QuestLength[] {
  if (l.includes('(')) {
    return mapLength(l.split(/\s*\(/)[0]);
  }
  if (l.includes('-') || l.includes('/')) {
    return l.split(/\s*[-\/]\s*/g).map(mapLength) as QuestLength[];
  }

  switch (l) {
    case 'Short':
      return QuestLength.SHORT;
    case 'Medium':
      return QuestLength.MEDIUM;
    case 'Long':
      return QuestLength.LONG;
    case 'Very long':
      return QuestLength.VLONG;
    case 'Very Short':
      return QuestLength.VSHORT;
    default:
      throw new Error(`Unknown length: ${l}`);
  }
}

function mapSkill(skill: string): Skill {
  switch (skill) {
    case 'attack':
      return Skill.ATTACK;
    case 'defence':
      return Skill.DEFENCE;
    case 'strength':
      return Skill.STRENGTH;
    case 'mining':
      return Skill.MINING;
    case 'smithing':
      return Skill.SMITHING;
    case 'agility':
      return Skill.AGILITY;
    case 'construction':
      return Skill.CONSTRUCTION;
    case 'cooking':
      return Skill.COOKING;
    case 'crafting':
      return Skill.CRAFTING;
    case 'farming':
      return Skill.FARMING;
    case 'firemaking':
      return Skill.FIREMAKING;
    case 'fishing':
      return Skill.FISHING;
    case 'fletching':
      return Skill.FLETCHING;
    case 'herblore':
      return Skill.HERBLORE;
    case 'hunter':
      return Skill.HUNTER;
    case 'magic':
      return Skill.MAGIC;
    case 'prayer':
      return Skill.PRAYER;
    case 'ranged':
      return Skill.RANGED;
    case 'runecrafting':
      return Skill.RUNECRAFTING;
    case 'slayer':
      return Skill.SLAYER;
    case 'thieving':
      return Skill.THIEVING;
    case 'woodcutting':
      return Skill.WOODCUTTING;
    case 'quest':
      return Skill.QP;
    case 'combat':
      return Skill.COMBAT;
    case 'hitpoints':
      return Skill.HITPOINTS;
    default:
      throw new Error(`Unknown skill: ${skill}`);
  }
}

const v = Object.values(raw)
  .map((quest: any) => {
    if (quest.Miniquest) {
      quest.mini = true;
    }
    if (!quest.members) {
      delete quest.members;
    }

    quest.difficulty = mapDifficulty(quest.Difficulty);
    quest.name = quest.Name;
    quest.length = mapLength(quest.Length);

    quest.slug = quest.url.replace('https://oldschool.runescape.wiki/w/', '');

    for (const lv of quest.requirements.levels) {
      lv.skill = mapSkill(lv.skill);
      if (!lv.boostable) {
        delete lv.boostable;
      }
    }

    delete quest.url;
    quest.qp = quest.Rewards.QuestPoints || 0;
    delete quest.Difficulty;
    delete quest.Length;
    delete quest.Name;
    delete quest.Miniquest;
    delete quest.Rewards;
    return quest;
  });

fs.writeFileSync('./src/questlist/questlist.json', JSON.stringify(v, null, 2) + '\n');
