export const ACTIVITY_TYPES = [
  { key: "watering", label: "Tưới nước" },
  { key: "fertilizing", label: "Bón phân" },
  { key: "pesticide", label: "Phun thuốc" },
  { key: "weeding", label: "Làm cỏ" },
  { key: "pruning", label: "Tỉa cành" },
  { key: "harvest", label: "Thu hoạch" },
] as const;
export type ActivityKey = (typeof ACTIVITY_TYPES)[number]["key"];

export const MASS_UNITS = [
  { key: "kg", label: "kg" },
  { key: "t", label: "tấn" },
] as const;
