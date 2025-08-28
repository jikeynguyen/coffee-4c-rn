import type { PlanResult } from "../calculators/plan";

let lastPlan: PlanResult | null = null;

export const planStore = {
  set(result: PlanResult) {
    lastPlan = result;
  },
  get(): PlanResult | null {
    return lastPlan;
  },
};
