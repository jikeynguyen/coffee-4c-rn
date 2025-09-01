export type PlanInput = {
  areaHa: number;
  densityPerHa: number;
  seedlingPrice?: number;
  seedlingReserveRate?: number;
  plantingLaborPerTree?: number;
  basalFertPerTree?: number;
  rootInsecticidePerKg?: number;
  rootInsecticideKgPerTree?: number;
  irrigationPerHa?: number;
  plowingPerHa?: number;
  pesticidesMonthlyPerHaY1?: number;
  pesticidesMonthlyPerHaY2?: number;
  pesticidesMonthlyPerHaY3?: number;
  mgmtPerMonthPerHa?: number;
  fertilizerComboPerHaY1?: number;
  fertilizerComboPerHaY2?: number;
  fertilizerComboPerHaY3?: number;
  irrigationFuelPerHa?: number;
  grassCutPerHaPerTime?: number;
  grassCutTimesY1?: number;
  grassCutTimesY2?: number;
  grassCutTimesY3?: number;
  yieldFreshKgPerTreeY2?: number;
  yieldFreshKgPerTreeY3?: number;
  freshToGreenRatio?: number;
  greenPrice?: number;
  harvestCostPerKgFresh?: number;
};

export type PlanOverview = {
  areaHa: number;
  densityPerHa: number;
  totalTrees: number;
  seedlingReserve: number;
  totalSeedlings: number;
};

export type CashflowYear = {
  year: number;
  cost: number;
  revenue: number;
  net: number;
  breakdown: { label: string; amount: number }[];
};

export type SuppliesItem = {
  name: string;
  unit: string;
  qty: number;
  price: number;
  amount: number;
  note?: string;
};

export type SuppliesByYear = {
  year: 1 | 2 | 3;
  items: SuppliesItem[];
  total: number;
};

export type PlanResult = {
  overview: PlanOverview;
  cashflow: CashflowYear[];
  suppliesByYear: SuppliesByYear[];
};

function sum(items: { amount: number }[]) {
  return items.reduce((s, i) => s + i.amount, 0);
}

// ===== Defaults =====
export const DEFAULTS: Required<
  Pick<
    PlanInput,
    | "seedlingPrice"
    | "seedlingReserveRate"
    | "plantingLaborPerTree"
    | "basalFertPerTree"
    | "rootInsecticidePerKg"
    | "rootInsecticideKgPerTree"
    | "irrigationPerHa"
    | "plowingPerHa"
    | "pesticidesMonthlyPerHaY1"
    | "pesticidesMonthlyPerHaY2"
    | "pesticidesMonthlyPerHaY3"
    | "mgmtPerMonthPerHa"
    | "fertilizerComboPerHaY1"
    | "fertilizerComboPerHaY2"
    | "fertilizerComboPerHaY3"
    | "irrigationFuelPerHa"
    | "grassCutPerHaPerTime"
    | "grassCutTimesY1"
    | "grassCutTimesY2"
    | "grassCutTimesY3"
    | "yieldFreshKgPerTreeY2"
    | "yieldFreshKgPerTreeY3"
    | "freshToGreenRatio"
    | "greenPrice"
    | "harvestCostPerKgFresh"
  >
> = {
  seedlingPrice: 17_000,
  seedlingReserveRate: 0.05,
  plantingLaborPerTree: 8_000,
  basalFertPerTree: 10_800,
  rootInsecticidePerKg: 100_000,
  rootInsecticideKgPerTree: 1 / 200,
  irrigationPerHa: 58_000_000,
  plowingPerHa: 6_000_000,
  pesticidesMonthlyPerHaY1: 200_000,
  pesticidesMonthlyPerHaY2: 333_333,
  pesticidesMonthlyPerHaY3: 500_000,
  mgmtPerMonthPerHa: 1_333_333,
  fertilizerComboPerHaY1: 45_000_000,
  fertilizerComboPerHaY2: 50_000_000,
  fertilizerComboPerHaY3: 80_000_000,
  irrigationFuelPerHa: 8_000_000,
  grassCutPerHaPerTime: 2_500_000,
  grassCutTimesY1: 4,
  grassCutTimesY2: 1,
  grassCutTimesY3: 4,
  yieldFreshKgPerTreeY2: 4,
  yieldFreshKgPerTreeY3: 15,
  freshToGreenRatio: 4.3,
  greenPrice: 80_000,
  harvestCostPerKgFresh: 1_000,
};

// ===== Base calcPlan (giữ nguyên thuật toán) =====
export function calcPlan(input: PlanInput): PlanResult {
  const cfg = { ...DEFAULTS, ...input };
  const area = input.areaHa;
  const density = input.densityPerHa;

  const totalTrees = Math.round(area * density);
  const seedlingReserve = Math.ceil(totalTrees * cfg.seedlingReserveRate);
  const totalSeedlings = totalTrees + seedlingReserve;

  const overview: PlanOverview = {
    areaHa: area,
    densityPerHa: density,
    totalTrees,
    seedlingReserve,
    totalSeedlings,
  };

  // Year 1
  const y1Items: SuppliesItem[] = [
    {
      name: "Cây giống",
      unit: "cây",
      qty: totalSeedlings,
      price: cfg.seedlingPrice,
      amount: totalSeedlings * cfg.seedlingPrice,
      note: `dự phòng ${Math.round(cfg.seedlingReserveRate * 100)}%`,
    },
    {
      name: "Hệ thống tưới",
      unit: "ha",
      qty: area,
      price: cfg.irrigationPerHa,
      amount: area * cfg.irrigationPerHa,
    },
    {
      name: "Cày/xới đất",
      unit: "ha",
      qty: area,
      price: cfg.plowingPerHa,
      amount: area * cfg.plowingPerHa,
    },
    {
      name: "Công trồng/đào hố",
      unit: "cây",
      qty: totalSeedlings,
      price: cfg.plantingLaborPerTree,
      amount: totalSeedlings * cfg.plantingLaborPerTree,
    },
    {
      name: "Bón lót (phân gà nở)",
      unit: "cây",
      qty: totalSeedlings,
      price: cfg.basalFertPerTree,
      amount: totalSeedlings * cfg.basalFertPerTree,
    },
    {
      name: "Thuốc sâu gốc",
      unit: "kg",
      qty: Math.ceil(totalSeedlings * cfg.rootInsecticideKgPerTree),
      price: cfg.rootInsecticidePerKg,
      amount:
        Math.ceil(totalSeedlings * cfg.rootInsecticideKgPerTree) *
        cfg.rootInsecticidePerKg,
    },
    {
      name: "Thuốc sâu/nấm (12 tháng)",
      unit: "năm·ha",
      qty: area,
      price: cfg.pesticidesMonthlyPerHaY1 * 12,
      amount: area * cfg.pesticidesMonthlyPerHaY1 * 12,
    },
    {
      name: "Quản lý (12 tháng)",
      unit: "năm·ha",
      qty: area,
      price: cfg.mgmtPerMonthPerHa * 12,
      amount: area * cfg.mgmtPerMonthPerHa * 12,
    },
    {
      name: "Combo phân bón Năm 1",
      unit: "ha",
      qty: area,
      price: cfg.fertilizerComboPerHaY1,
      amount: area * cfg.fertilizerComboPerHaY1,
    },
    {
      name: `Cắt cỏ (${cfg.grassCutTimesY1} lần)`,
      unit: "lần·ha",
      qty: area * cfg.grassCutTimesY1,
      price: cfg.grassCutPerHaPerTime,
      amount: area * cfg.grassCutTimesY1 * cfg.grassCutPerHaPerTime,
    },
    {
      name: "Tưới nước, dầu máy",
      unit: "ha",
      qty: area,
      price: cfg.irrigationFuelPerHa,
      amount: area * cfg.irrigationFuelPerHa,
    },
  ];
  const y1Cost = sum(y1Items);

  // Year 2
  const y2Items: SuppliesItem[] = [
    {
      name: "Quản lý (12 tháng)",
      unit: "năm·ha",
      qty: area,
      price: cfg.mgmtPerMonthPerHa * 12,
      amount: area * cfg.mgmtPerMonthPerHa * 12,
    },
    {
      name: "Combo phân bón Năm 2",
      unit: "ha",
      qty: area,
      price: cfg.fertilizerComboPerHaY2,
      amount: area * cfg.fertilizerComboPerHaY2,
    },
    {
      name: "Thuốc sâu/nấm (12 tháng)",
      unit: "năm·ha",
      qty: area,
      price: cfg.pesticidesMonthlyPerHaY2 * 12,
      amount: area * cfg.pesticidesMonthlyPerHaY2 * 12,
    },
    {
      name: "Tưới nước, dầu máy",
      unit: "ha",
      qty: area,
      price: cfg.irrigationFuelPerHa,
      amount: area * cfg.irrigationFuelPerHa,
    },
    {
      name: `Cắt cỏ (${cfg.grassCutTimesY2} lần)`,
      unit: "lần·ha",
      qty: area * cfg.grassCutTimesY2,
      price: cfg.grassCutPerHaPerTime,
      amount: area * cfg.grassCutTimesY2 * cfg.grassCutPerHaPerTime,
    },
  ];
  const y2Cost = sum(y2Items);

  // Year 3
  const y3Items: SuppliesItem[] = [
    {
      name: "Quản lý (12 tháng)",
      unit: "năm·ha",
      qty: area,
      price: cfg.mgmtPerMonthPerHa * 12,
      amount: area * cfg.mgmtPerMonthPerHa * 12,
    },
    {
      name: "Combo phân bón Năm 3",
      unit: "ha",
      qty: area,
      price: cfg.fertilizerComboPerHaY3,
      amount: area * cfg.fertilizerComboPerHaY3,
    },
    {
      name: "Thuốc sâu/nấm (12 tháng)",
      unit: "năm·ha",
      qty: area,
      price: cfg.pesticidesMonthlyPerHaY3 * 12,
      amount: area * cfg.pesticidesMonthlyPerHaY3 * 12,
    },
    {
      name: "Tưới nước, dầu máy",
      unit: "ha",
      qty: area,
      price: cfg.irrigationFuelPerHa,
      amount: area * cfg.irrigationFuelPerHa,
    },
    {
      name: `Cắt cỏ (${cfg.grassCutTimesY3} lần)`,
      unit: "lần·ha",
      qty: area * cfg.grassCutTimesY3,
      price: cfg.grassCutPerHaPerTime,
      amount: area * cfg.grassCutTimesY3 * cfg.grassCutPerHaPerTime,
    },
  ];
  const y3Cost = sum(y3Items);

  // Revenue
  const treesCount = overview.totalTrees;
  const y2Fresh = treesCount * (cfg.yieldFreshKgPerTreeY2 ?? 0);
  const y2HarvestCost = y2Fresh * cfg.harvestCostPerKgFresh;
  const y2GreenKg = y2Fresh / cfg.freshToGreenRatio;
  const y2Revenue = y2GreenKg * cfg.greenPrice - y2HarvestCost;

  const y3Fresh = treesCount * (cfg.yieldFreshKgPerTreeY3 ?? 0);
  const y3HarvestCost = y3Fresh * cfg.harvestCostPerKgFresh;
  const y3GreenKg = y3Fresh / cfg.freshToGreenRatio;
  const y3Revenue = y3GreenKg * cfg.greenPrice - y3HarvestCost;

  const cashflow: CashflowYear[] = [
    {
      year: 1,
      cost: y1Cost,
      revenue: 0,
      net: -y1Cost,
      breakdown: y1Items.map((i) => ({ label: i.name, amount: i.amount })),
    },
    {
      year: 2,
      cost: y2Cost,
      revenue: y2Revenue,
      net: y2Revenue - y2Cost,
      breakdown: y2Items.map((i) => ({ label: i.name, amount: i.amount })),
    },
    {
      year: 3,
      cost: y3Cost,
      revenue: y3Revenue,
      net: y3Revenue - y3Cost,
      breakdown: y3Items.map((i) => ({ label: i.name, amount: i.amount })),
    },
  ];

  const suppliesByYear: SuppliesByYear[] = [
    { year: 1, items: y1Items, total: y1Cost },
    { year: 2, items: y2Items, total: y2Cost },
    { year: 3, items: y3Items, total: y3Cost },
  ];

  return { overview, cashflow, suppliesByYear };
}

// ===== Env + Modifiers =====
export type CropType = "robusta" | "arabica";
export type EnvInput = {
  crop: CropType;
  lat: number;
  lng: number;
  elevation_m?: number;
  slope_deg?: number;
  soilTexture: "sand" | "loam" | "clay";
  ph: number;
  organicMatterPct?: number;
  cec?: number;
  annualRain_mm: number;
  tmean_c: number;
  rh_pct?: number;
};

export type Modifiers = {
  yieldMulY2: number;
  yieldMulY3: number;
  fertCostMulY1: number;
  fertCostMulY2: number;
  fertCostMulY3: number;
  pesticideCostMul: number;
  irrigationFuelMul: number;
  addSupplies?: {
    name: string;
    unit: string;
    qty: number;
    price?: number;
    note?: string;
  }[];
};

const clamp = (x: number, min: number, max: number) =>
  Math.max(min, Math.min(max, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function triangle(x: number, center: number, left: number, right: number) {
  if (x <= left || x >= right) return 0;
  if (x === center) return 1;
  return x < center
    ? (x - left) / (center - left)
    : (right - x) / (right - center);
}
function rainClass(rain: number) {
  if (rain < 1200) return "dry";
  if (rain <= 1800) return "mid";
  return "wet";
}
function tempScore(crop: CropType, t: number) {
  return crop === "robusta" ? triangle(t, 24, 20, 30) : triangle(t, 20, 15, 24);
}
function phPenalty(crop: CropType, ph: number) {
  const [l, u] = crop === "robusta" ? [5.0, 6.0] : [5.5, 6.5];
  if (ph >= l && ph <= u) return 1;
  const dist = Math.min(Math.abs(ph - l), Math.abs(ph - u));
  return clamp(1 - 0.2 * (dist / 0.5), 0.7, 1);
}
function textureIrrMul(tex: "sand" | "loam" | "clay") {
  if (tex === "sand") return 1.15;
  if (tex === "clay") return 0.95;
  return 1.0;
}
function textureFertMul(tex: "sand" | "loam" | "clay") {
  if (tex === "sand") return 1.1;
  if (tex === "clay") return 0.97;
  return 1.0;
}
function rhPestMul(rh?: number) {
  if (!rh) return 1.0;
  if (rh >= 85) return 1.15;
  if (rh <= 60) return 0.9;
  return 1.0;
}
function waterDeficitMul(rain: number) {
  const c = rainClass(rain);
  if (c === "dry") return 1.2;
  if (c === "wet") return 0.9;
  return 1.0;
}
function limeNeed_kg_per_ha(crop: CropType, ph: number) {
  const target = crop === "robusta" ? 5.5 : 6.0;
  const deficit = target - ph;
  if (deficit <= 0) return 0;
  return Math.ceil((deficit / 0.5) * 500);
}
export function deriveModifiers(env: EnvInput): Modifiers {
  const tScore = tempScore(env.crop, env.tmean_c);
  const phMul = phPenalty(env.crop, env.ph);
  const rainMulIrr = waterDeficitMul(env.annualRain_mm);
  const texIrr = textureIrrMul(env.soilTexture);
  const texFert = textureFertMul(env.soilTexture);
  const pestMul = rhPestMul(env.rh_pct);

  const yieldBase = clamp(tScore * phMul, 0.65, 1.05);
  const yieldMulY2 = clamp(lerp(0.8, 1.0, yieldBase), 0.6, 1.1);
  const yieldMulY3 = clamp(lerp(0.9, 1.1, yieldBase), 0.7, 1.2);

  const fertMul = clamp(texFert * (phMul < 1 ? 1.05 : 1.0), 0.9, 1.2);
  const irrigationFuelMul = clamp(rainMulIrr * texIrr, 0.85, 1.35);
  const pesticideCostMul = clamp(pestMul, 0.85, 1.25);

  const limeKg = limeNeed_kg_per_ha(env.crop, env.ph);
  const addSupplies =
    limeKg > 0
      ? [
          {
            name: "Vôi nông nghiệp",
            unit: "kg/ha",
            qty: limeKg,
            note: "Điều chỉnh pH",
          },
        ]
      : [];

  return {
    yieldMulY2,
    yieldMulY3,
    fertCostMulY1: fertMul,
    fertCostMulY2: fertMul,
    fertCostMulY3: fertMul,
    pesticideCostMul,
    irrigationFuelMul,
    addSupplies,
  };
}

// ===== Policy từ chuẩn tuân thủ (tùy chọn) =====
export type StandardItem = { id: string; text: string; weight: number };
export type StandardsMap = Record<
  string,
  { title: string; items: StandardItem[] }
>;
export type CheckedMap = Record<string, boolean>;

export function scoreCompliance(standards: StandardsMap, checked: CheckedMap) {
  const result: Record<
    string,
    { score: number; max: number; percent: number; missing: StandardItem[] }
  > = {};
  for (const key of Object.keys(standards)) {
    const items = standards[key].items;
    const max = items.reduce((s, i) => s + i.weight, 0);
    const doneW = items.reduce((s, i) => s + (checked[i.id] ? i.weight : 0), 0);
    const percent = max > 0 ? Math.round((doneW / max) * 100) : 0;
    const missing = items
      .filter((i) => !checked[i.id])
      .sort((a, b) => b.weight - a.weight);
    result[key] = { score: doneW, max, percent, missing };
  }
  return result;
}

export type Policy = {
  allowSyntheticPesticide?: boolean;
  pesticideCostMulCap?: number;
};
export function policyFromCompliance(
  score: Record<string, { percent: number }>
): Policy {
  const p: Policy = {};
  if (score["Organic"] && score["Organic"].percent < 100)
    p.allowSyntheticPesticide = false;
  if (score["RA"] && score["RA"].percent < 70) p.pesticideCostMulCap = 1.0;
  return p;
}

// ===== Adapter: Env + Policy → Plan =====
export function calcPlanFromEnv(
  base: PlanInput,
  env: EnvInput,
  priceBook?: { limePricePerKg?: number },
  policy?: Policy
): PlanResult {
  const mods = deriveModifiers(env);

  // áp chính sách
  let pesticideMul = mods.pesticideCostMul;
  if (policy?.pesticideCostMulCap !== undefined) {
    pesticideMul = Math.min(pesticideMul, policy.pesticideCostMulCap);
  }

  const inputAdj: PlanInput = {
    ...base,
    fertilizerComboPerHaY1: Math.round(
      (base.fertilizerComboPerHaY1 ?? 0) * mods.fertCostMulY1
    ),
    fertilizerComboPerHaY2: Math.round(
      (base.fertilizerComboPerHaY2 ?? 0) * mods.fertCostMulY2
    ),
    fertilizerComboPerHaY3: Math.round(
      (base.fertilizerComboPerHaY3 ?? 0) * mods.fertCostMulY3
    ),
    pesticidesMonthlyPerHaY1:
      policy?.allowSyntheticPesticide === false
        ? 0
        : Math.round((base.pesticidesMonthlyPerHaY1 ?? 0) * pesticideMul),
    pesticidesMonthlyPerHaY2:
      policy?.allowSyntheticPesticide === false
        ? 0
        : Math.round((base.pesticidesMonthlyPerHaY2 ?? 0) * pesticideMul),
    pesticidesMonthlyPerHaY3:
      policy?.allowSyntheticPesticide === false
        ? 0
        : Math.round((base.pesticidesMonthlyPerHaY3 ?? 0) * pesticideMul),
    irrigationFuelPerHa: Math.round(
      (base.irrigationFuelPerHa ?? 0) * mods.irrigationFuelMul
    ),
    yieldFreshKgPerTreeY2: Math.round(
      (base.yieldFreshKgPerTreeY2 ?? 0) * mods.yieldMulY2
    ),
    yieldFreshKgPerTreeY3: Math.round(
      (base.yieldFreshKgPerTreeY3 ?? 0) * mods.yieldMulY3
    ),
  };

  const res = calcPlan(inputAdj);

  // thêm vôi nếu cần
  if (mods.addSupplies?.length) {
    const price = priceBook?.limePricePerKg ?? 2500;
    const lime = mods.addSupplies[0];
    const area = res.overview.areaHa;
    const amount = area * lime.qty * price;

    res.suppliesByYear[0].items.push({
      name: lime.name,
      unit: "kg",
      qty: area * lime.qty,
      price,
      amount,
      note: lime.note,
    });
    res.suppliesByYear[0].total += amount;

    const y1 = res.cashflow.find((y) => y.year === 1)!;
    y1.cost += amount;
    y1.net = y1.revenue - y1.cost;
    y1.breakdown.push({ label: lime.name, amount });
  }

  // nếu bị khóa thuốc BVTV do Organic, thêm nhắc IPM (amount=0)
  if (policy?.allowSyntheticPesticide === false) {
    res.suppliesByYear[0].items.push({
      name: "IPM/Biological control plan",
      unit: "gói khuyến nghị",
      qty: 1,
      price: 0,
      amount: 0,
      note: "Organic: không dùng thuốc tổng hợp",
    });
  }

  return res;
}
