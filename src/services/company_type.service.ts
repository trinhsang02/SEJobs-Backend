import _ from "lodash";
import { NotFoundError } from "@/utils/errors";
import companyTypesRepository from "@/repositories/company_types.repository";
import { CompanyTypeQueryParams } from "@/types/common";
import { CreateCompanyTypeDto } from "@/dtos/company/CreateCompanyType.dto";
import { UpdateCompanyTypeDto } from "@/dtos/company/UpdateComnayType.dto";

export class CompanyTypeService {

  async findAll(input: CompanyTypeQueryParams) {
    const data = await companyTypesRepository.findAll(input);

    return data;
  }

  async findOne(input: { company_type_id: number }) {
    const { company_type_id } = input;

    const companyType = await companyTypesRepository.findOne({ company_type_ids: [company_type_id] });

    if (!companyType) {
      throw new NotFoundError({ message: `Company type with ID ${company_type_id} not found` });
    }

    return companyType;
  }

  async create(input: { companyTypeData: CreateCompanyTypeDto }) {
    const { companyTypeData } = input;

    const newCompanyType = await companyTypesRepository.create({ companyTypeData: {
        name: companyTypeData.name,
    }});

    return newCompanyType;
  }

  async update(input: { companyTypeId: number; companyTypeData: UpdateCompanyTypeDto }) {
    const { companyTypeId, companyTypeData } = input;

    const existingCompanyType = await this.findOne({ company_type_id: companyTypeId });

    if (!existingCompanyType) {
      throw new NotFoundError({ message: `Company type with ID ${companyTypeId} not found` });
    }

    const updateData = _.pickBy(
      {
        ...companyTypeData,
        updated_at: companyTypeData.updated_at || new Date().toISOString(),
      },
      (value) => value != null && value !== ""
    );

    const updatedCompanyType = await companyTypesRepository.update({
      companyTypeId,
      companyTypeData: updateData,
    });

    return updatedCompanyType;
  }

  async delete(companyTypeId: number) {
    const deletedCompanyType = await companyTypesRepository.delete(companyTypeId);

    if (!deletedCompanyType) {
    throw new NotFoundError({ message: `Company type with ID ${companyTypeId} not found` });
    }

    return deletedCompanyType;
  }
}

export default new CompanyTypeService();
