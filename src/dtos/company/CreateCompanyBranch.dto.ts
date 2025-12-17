import z from "zod";

export const createCompanyBranchSchema = z.object({
    id: z.number().optional(),
    company_id: z.number("Company ID is required"),
    name: z.string().min(1, "Branch name is required"),
    address: z.string().nullable().optional(),
    country_id: z.number().nullable().optional(),
    province_id: z.number().nullable().optional(),
    ward_id: z.number().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
});

export type CreateCompanyBranchDto = z.infer<typeof createCompanyBranchSchema>;