export type PlanInput = {
  areaHa: number; // diện tích (ha)
  densityPerHa: number; // mật độ (cây/ha)
  // tuỳ chọn: override mặc định
  seedlingPrice?: number; // giá cây giống
  seedlingReserveRate?: number; // % dự phòng cây giống
  plantingLaborPerTree?: number;
  basalFertPerTree?: number; // bón lót tính theo cây (VNĐ/cây)
  rootInsecticidePerKg?: number;
  rootInsecticideKgPerTree?: number; // kg/cây (vd 1kg/200 cây = 0.005)
  irrigationPerHa?: number; // hệ thống tưới /ha
  plowingPerHa?: number; // cày/xới /ha
  pesticidesMonthlyPerHaY1?: number; // thuốc sâu/nấm mỗi tháng/ha (năm 1)
  pesticidesMonthlyPerHaY2?: number; // năm 2
  pesticidesMonthlyPerHaY3?: number; // năm 3
  mgmtPerMonthPerHa?: number; // quản lý /tháng/ha
  fertilizerComboPerHaY1?: number;
  fertilizerComboPerHaY2?: number;
  fertilizerComboPerHaY3?: number;
  irrigationFuelPerHa?: number; // tưới nước, dầu máy /ha
  grassCutPerHaPerTime?: number;
  grassCutTimesY1?: number;
  grassCutTimesY2?: number;
  grassCutTimesY3?: number;

  // Sản lượng và giá
  yieldFreshKgPerTreeY2?: number; // kg tươi/cây
  yieldFreshKgPerTreeY3?: number;
  freshToGreenRatio?: number; // 4.3 kg tươi = 1 kg nhân → 4.3
  greenPrice?: number; // VNĐ/kg nhân
  harvestCostPerKgFresh?: number; // công hái VNĐ/kg tươi
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
  unit: string; // "cây", "ha", "kg", "lần·ha"
  qty: number;
  price: number; // đơn giá theo unit
  amount: number; // = qty * price
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

// Mặc định được hiệu chỉnh để gần với case mẫu (6 ha, 1666 cây/ha)
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
  seedlingReserveRate: 0.05, // dự phòng 5% cây giống
  plantingLaborPerTree: 8_000,
  basalFertPerTree: 10_800,
  rootInsecticidePerKg: 100_000,
  rootInsecticideKgPerTree: 1 / 200, // 1kg/200 cây
  irrigationPerHa: 58_000_000,
  plowingPerHa: 6_000_000,
  pesticidesMonthlyPerHaY1: 200_000, // 1.2tr/tháng toàn dự án 6ha -> ~200k/ha/tháng
  pesticidesMonthlyPerHaY2: 333_333, // 2tr/tháng toàn dự án 6ha -> ~333k/ha/tháng
  pesticidesMonthlyPerHaY3: 500_000, // giả định 3tr/tháng toàn dự án 6ha -> ~500k/ha/tháng
  mgmtPerMonthPerHa: 1_333_333, // 8tr/tháng / 6ha
  fertilizerComboPerHaY1: 45_000_000,
  fertilizerComboPerHaY2: 50_000_000,
  fertilizerComboPerHaY3: 80_000_000,
  irrigationFuelPerHa: 8_000_000,
  grassCutPerHaPerTime: 2_500_000,
  grassCutTimesY1: 4,
  grassCutTimesY2: 1, // để khớp 15tr cho 6ha trong mẫu
  grassCutTimesY3: 4,

  yieldFreshKgPerTreeY2: 4,
  yieldFreshKgPerTreeY3: 15,
  freshToGreenRatio: 4.3,
  greenPrice: 80_000,
  harvestCostPerKgFresh: 1_000,
};

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

  // ===== Chi phí theo năm để khớp cashflow =====
  // Year 1 items
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

  // Year 2 items
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

  // Year 3 items
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

  // Doanh thu như trước
  const y2Fresh = totalTrees * cfg.yieldFreshKgPerTreeY2;
  const y2HarvestCost = y2Fresh * cfg.harvestCostPerKgFresh;
  const y2GreenKg = y2Fresh / cfg.freshToGreenRatio;
  const y2Revenue = y2GreenKg * cfg.greenPrice - y2HarvestCost;

  const y3Fresh = totalTrees * cfg.yieldFreshKgPerTreeY3;
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

function sum(items: { amount: number }[]) {
  return items.reduce((s, i) => s + i.amount, 0);
}
