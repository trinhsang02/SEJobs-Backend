import { z } from "zod";

/**
 * Query DTO for listing jobs.
 * Supports: page, per_page, keyword, city_id, category_id, exp_id, fields
 */

export const queryJobsSchema = z.object({
  page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? undefined : Number(v))),
  per_page: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? undefined : Number(v))),
  keyword: z.string().optional(),
  city_id: z.union([z.string(), z.number()]).optional(),
  category_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? undefined : Number(v))),
  exp_id: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === undefined ? undefined : Number(v))),
  fields: z.string().optional(),
});

export type QueryJobsDto = z.infer<typeof queryJobsSchema>;
