import { CreateCompanyBranchDto } from "@/dtos/company/CreateCompanyBranch.dto";
import { UpdateCompanyBranchDto } from "@/dtos/company/UpdateCompanyBranch.dto";
import companyBranchesRepository from "@/repositories/company_branches.repository";
import { CompanyBranchesQueryAll } from "@/types/common";
import { NotFoundError } from "@/utils/errors";
import _, { update } from "lodash";

export class CompanyBranchesService {
    async findAll(input: CompanyBranchesQueryAll) {
        const data = await companyBranchesRepository.findAll(input);
        return data;
    }

    async findOne(input: { id: number }) {
        const { id } = input;

        const company = await companyBranchesRepository.findOne({ id });

        if (!company) {
            throw new NotFoundError({ message: `Company with ID ${id} not found` });
        }

        return company;
    }

    async createBranch(input: { branchData: CreateCompanyBranchDto }) {
        const { branchData } = input;

        const newBranch = await companyBranchesRepository.create({
            branchData: {
                name: branchData.name,
                company_id: branchData.company_id || null,
                country_id: branchData.country_id || null,
                province_id: branchData.province_id || null,
                ward_id: branchData.ward_id || null,
                address: branchData.address || null,
            },
        });
        return newBranch;
    }

    async updateBranch(input: { branchId: number; branchData: UpdateCompanyBranchDto }) {
        const { branchId, branchData } = input;

        const existingBranch = await companyBranchesRepository.findOne({ id: branchId });

        if (!existingBranch) {
            throw new NotFoundError({ message: `Company branch with ID ${branchId} not found` });
        }

        const updateData = _.pickBy(
            {
                ...branchData,
                updated_at: branchData.updated_at || new Date().toISOString(),
            }, (v) => v !== null && v !== undefined && v !== ""
        );

        const updatedBranch = await companyBranchesRepository.update({
            branchId,
            branchData: updateData,
        });
        return updatedBranch;
    }

    async delete(branchId: number) {
        const deletedBranch = await companyBranchesRepository.delete(branchId);
        if (!deletedBranch) {
            throw new NotFoundError({ message: `Company branch with ID ${branchId} not found` });
        }
        return deletedBranch;
    }
}

export default new CompanyBranchesService();