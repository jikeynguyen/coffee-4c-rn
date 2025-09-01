import { z } from "zod";

export const planSchema = z.object({
  area: z.number().positive(),
  density: z.number().int().positive(),
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),

  soilType: z.string().min(1),
  ph: z.number().min(3).max(9),
  annualRain: z.number().min(200).max(4000),
  tmean: z.number().min(5).max(40),
  rh: z.number().min(0).max(100).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),

  plantingMonth: z.number().int().min(1).max(12),

  // BẮT BUỘC, không default trong schema để input không bao giờ là undefined
  certifications: z.array(
    z.enum(["4C", "RA", "UTZ", "FLO", "VietGAP", "GlobalGAP", "Organic"])
  ),

  coffeeVariety: z.string().min(1),
});

export type PlanForm = z.infer<typeof planSchema>;
