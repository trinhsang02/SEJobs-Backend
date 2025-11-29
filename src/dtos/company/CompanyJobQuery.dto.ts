import { z } from "zod";

export const companyJobQuerySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type CompanyJobQueryDto = z.infer<typeof companyJobQuerySchema>;
