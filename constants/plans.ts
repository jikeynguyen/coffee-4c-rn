export const SOIL_TYPES = [
  "Đất đỏ bazan",
  "Đất xám (xám bạc màu)",
  "Đất feralit trên đá bazan",
  "Đất phù sa",
  "Đất cát pha",
  "Đất đen",
  "Đất dốc tụ",
  "Đất mùn núi cao",
];

export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  label: `Tháng ${i + 1}`,
  value: i + 1,
}));

export const CERTS = [
  { key: "4C", label: "4C" },
  { key: "organic", label: "Organic" },
  { key: "vietgap", label: "VietGAP" },
  { key: "ggap", label: "Global G.A.P" },
  { key: "flo", label: "Fairtrade (FLO)" },
  { key: "utz", label: "UTZ" },
  { key: "rfa", label: "Rainforest Alliance" },
] as const;
export type CertKey = (typeof CERTS)[number]["key"];

export const COFFEE_VARIETIES = [
  "Robusta (Canephora)",
  "Arabica (Catimor)",
  "Arabica (Typica)",
  "Arabica (Bourbon)",
  "Excelsa (Chari)",
  "Liberica",
];
