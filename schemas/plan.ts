import { z } from "zod";
import { CERTS, CertKey } from "../constants/plans";

export const planSchema = z.object({
  area: z.number().min(0.1, ">= 0.1 ha"),
  density: z.number().min(1, ">= 1 cây/ha"),
  province: z.string().min(1, "Chọn tỉnh/thành"),
  district: z.string().min(1, "Chọn quận/huyện"),
  ward: z.string().min(1, "Chọn xã/phường"),
  soilType: z.string().min(1, "Chọn loại đất"),
  plantingMonth: z.number().min(1).max(12),
  certifications: z.array(
    z.enum(CERTS.map((c) => c.key) as [CertKey, ...CertKey[]])
  ),
  coffeeVariety: z.string().min(1, "Chọn giống"),
});
export type PlanForm = z.infer<typeof planSchema>;
