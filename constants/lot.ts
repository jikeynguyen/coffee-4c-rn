export function generateLotCode(dateYMD: string, weightKg: number) {
  // CF-YYYYMMDD-kgXXXXX
  const d = dateYMD.replaceAll("-", "");
  const pad = (n: number, w = 5) => String(n).padStart(w, "0");
  return `CF-${d}-kg${pad(Math.round(weightKg))}`;
}
