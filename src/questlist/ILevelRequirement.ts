import {Skill} from './Skill';

export interface ILevelRequirement {
  boostable?: true;

  level: number;

  skill: Skill;
}
