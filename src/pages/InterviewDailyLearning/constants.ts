import { interviewBasicPlan } from '../../data/interviewBasic';
import { interviewPenetrationPlan } from '../../data/interviewPenetration';
import { interviewDefensePlan } from '../../data/interviewDefense';
import { interviewAiPlan } from '../../data/interviewAi';
import { interviewHwPlan } from '../../data/interviewHw';
import { interviewCispPlan } from '../../data/interviewCisp';
import { interviewCtfPlan } from '../../data/interviewCtf';
import type { CyberLearningPlan } from '../../data/cyberBasic';

export const plans: Record<string, CyberLearningPlan> = {
  cisp: interviewCispPlan,
  basic: interviewBasicPlan,
  penetration: interviewPenetrationPlan,
  defense: interviewDefensePlan,
  ai: interviewAiPlan,
  hw: interviewHwPlan,
  ctf: interviewCtfPlan,
};

export const planSupplements: Record<string, Record<number, any>> = {
  cisp: {},
  basic: {},
  penetration: {},
  defense: {},
  ai: {},
  hw: {},
  ctf: {},
};

export { planColor } from '../../utils/planColors';
export type { PlanColor } from '../../utils/planColors';
