import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlanForm } from "@/schemas/plan";
import type { BuildParams } from "@/constants/guide";

const KEY = "last_build_params_v1";

const mapSoil = (s: string): BuildParams["soilTexture"] => {
  const t = s.toLowerCase();
  if (t.includes("cát")) return "sand";
  if (t.includes("sét") || t.includes("đất đen")) return "clay";
  return "loam";
};
const mapCrop = (v: string): BuildParams["crop"] =>
  /arabica/i.test(v) ? "arabica" : "robusta";

export function mapFormToBuildParams(f: PlanForm): BuildParams {
  return {
    crop: mapCrop(f.coffeeVariety),
    variety: f.coffeeVariety,
    plantingMonth: f.plantingMonth,
    soilTexture: mapSoil(f.soilType),
    ph: f.ph,
    annualRain_mm: f.annualRain,
    tmean_c: f.tmean,
    rh_pct: f.rh,
    certifications: f.certifications,
  };
}

export async function saveBuildParamsFromForm(f: PlanForm) {
  const p = mapFormToBuildParams(f);
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}

export async function loadBuildParams(): Promise<BuildParams | null> {
  const s = await AsyncStorage.getItem(KEY);
  return s ? (JSON.parse(s) as BuildParams) : null;
}

export function storageKeyForChecklist(p?: BuildParams) {
  const sig = p
    ? [
        p.crop,
        p.variety,
        p.plantingMonth,
        p.soilTexture,
        p.ph,
        p.annualRain_mm,
        p.tmean_c,
        ...(p.certifications ?? []),
      ].join("|")
    : "default";
  return `guide_checked_v2_${sig}`;
}
