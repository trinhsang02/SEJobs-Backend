import { z } from "zod";

export const companyJobQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CompanyJobQueryDto = z.infer<typeof companyJobQuerySchema>;
