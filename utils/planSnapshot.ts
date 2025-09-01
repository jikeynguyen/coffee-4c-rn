import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlanResult } from "@/calculators/plan";
import type { PlanForm } from "@/schemas/plan";

export const PLAN_SNAPSHOT_KEY = "plan_snapshot_v1";

export type PlanSnapshot = {
  areaHa: number;
  densityPerHa: number;
  totalTrees: number;
  y1Cost: number;
  y3Revenue: number;
  province?: string;
  district?: string;
  ward?: string;
};

export async function savePlanSnapshot(plan: PlanResult, form: PlanForm) {
  const y1 = plan.cashflow.find((x) => x.year === 1)?.cost ?? 0;
  const y3rev = plan.cashflow.find((x) => x.year === 3)?.revenue ?? 0;
  const snap: PlanSnapshot = {
    areaHa: plan.overview.areaHa,
    densityPerHa: plan.overview.densityPerHa,
    totalTrees: plan.overview.totalTrees,
    y1Cost: y1,
    y3Revenue: y3rev,
    province: form.province,
    district: form.district,
    ward: form.ward,
  };
  await AsyncStorage.setItem(PLAN_SNAPSHOT_KEY, JSON.stringify(snap));
}

export async function loadPlanSnapshot(): Promise<PlanSnapshot | null> {
  const s = await AsyncStorage.getItem(PLAN_SNAPSHOT_KEY);
  return s ? (JSON.parse(s) as PlanSnapshot) : null;
}
