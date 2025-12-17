import z from "zod";

export const updateCompanyBranchSchema = z.object({
    id: z.number().optional(),
    company_id: z.number().optional(),
    name: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    country_id: z.number().nullable().optional(),
    province_id: z.number().nullable().optional(),
    ward_id: z.number().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
});

export type UpdateCompanyBranchDto = z.infer<typeof updateCompanyBranchSchema>;