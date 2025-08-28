import { z } from "zod";
import type { ActivityKey } from "../constants/report";

const YMD = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

export const evidenceSchema = z.object({
  id: z.string(),
  date: z.string().regex(YMD, "Định dạng ngày YYYY-MM-DD"),
  activity: z.custom<ActivityKey>(),
  note: z.string().optional(),
  photoUri: z.string().optional(),
});
export type Evidence = z.infer<typeof evidenceSchema>;

export const harvestSchema = z.object({
  id: z.string(),
  date: z.string().regex(YMD, "Định dạng ngày YYYY-MM-DD"),
  weightKg: z.number().positive(),
  lotCode: z.string(),
  note: z.string().optional(),
});
export type HarvestLot = z.infer<typeof harvestSchema>;
