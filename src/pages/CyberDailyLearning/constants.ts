import { cyberBasicPlan } from '../../data/cyberBasic';
import { cyberPenetrationPlan } from '../../data/cyberPenetration';
import { cyberDefensePlan } from '../../data/cyberDefense';
import { cyberAiPlan } from '../../data/cyberAi';
import { cyberHwPlan } from '../../data/cyberHw';
import { cyberHwExpress28Plan } from '../../data/cyberHwExpress28';
import { cyberVendorPlan } from '../../data/cyberVendor';
import { cyberShootRangePlan } from '../../data/cyberShootRange';
import basicSupplement from '../../data/cyberBasicSupplement';
import penetrationSupplement from '../../data/cyberPenetrationSupplement';
import defenseSupplement from '../../data/cyberDefenseSupplement';
import supplement from '../../data/cyberAiSupplement';
import type { CyberLearningPlan } from '../../data/cyberBasic';

export const plans: Record<string, CyberLearningPlan> = {
  basic: cyberBasicPlan,
  penetration: cyberPenetrationPlan,
  defense: cyberDefensePlan,
  ai: cyberAiPlan,
  hw: cyberHwPlan,
  'hw-express': cyberHwExpress28Plan,
  vendor: cyberVendorPlan,
  'shoot-range': cyberShootRangePlan,
};

export const planSupplements: Record<string, Record<number, any>> = {
  basic: basicSupplement,
  penetration: penetrationSupplement,
  defense: defenseSupplement,
  ai: supplement,
  hw: {},
  'hw-express': {},
  vendor: {},
  'shoot-range': {},
};

export { planColor } from '../../utils/planColors';
export type { PlanColor } from '../../utils/planColors';
