import _ from "lodash";
import companyRepository from "@/repositories/company.repository";
import companyTypeRepository from "@/repositories/company_types.repository";
import { CreateCompanyDto } from "@/dtos/company/CreateCompany.dto";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import { CompanyQueryParams } from "@/types/common";
import { UpdateCompanyDto } from "@/dtos/company/UpdateCompany.dto";
import CompanyTypeService from "@/services/company_type.service";

export class CompanyService {

  async findAll(input: CompanyQueryParams) {
    const data = await companyRepository.findAll(input);

    return data;
  }

  async findOne(input: { company_id: number }) {
    const { company_id } = input;

    const company = await companyRepository.findOne({ company_id });

    if (!company) {
      throw new NotFoundError({ message: `Company with ID ${company_id} not found` });
    }

    return company;
  }

  async createCompany(input: { companyData: CreateCompanyDto }) {
    const { companyData } = input;

    const companyTypeIds: number[] = _.get(companyData, "company_types", []);

    if (companyTypeIds.length > 0) {
      const { data: companyTypes} = await CompanyTypeService.findAll({ company_type_ids: companyTypeIds });

      if (companyTypes.length !== companyTypeIds.length) {
        throw new BadRequestError({ message: 'Company type not found.' });
      }
    }

    const newCompany = await companyRepository.create({ companyData: {
        name: companyData.name,
        background: companyData.background || null,
        description: companyData.description || null,
        email: companyData.email || null,
        employee_count: companyData.employee_count || 0,
        external_id: companyData.external_id || 0,
        website_url: companyData.website_url || null,
        images: companyData.images || [],
        tech_stack: companyData.tech_stack || [],
        logo: companyData.logo || null,
        phone: companyData.phone || null,
        socials: companyData.socials || []
    }});

    // TODO/BUG: HANDLE WITH TRANSACTION
    if (companyTypeIds) {
      await companyTypeRepository.bulkCreateCompanyCompanyTypes({
        companyCompanyTypesData: companyTypeIds.map((company_type_id) => ({
          company_id: newCompany.id,
          company_type_id: company_type_id,
        }))
      });
    }

    return newCompany;
  }

  async updateCompany(input: { companyId: number; companyData: UpdateCompanyDto }) {
    const { companyId, companyData } = input;

    const existingCompany = await this.findOne({ company_id: companyId });

    if (!existingCompany) {
      throw new NotFoundError({ message: `Company with ID ${companyId} not found` });
    }

    const updateData = _.pickBy(
      {
        ...companyData,
        updated_at: companyData.updated_at || new Date().toISOString(),
      },
      (value) => value != null && value !== ""
    );

    const updatedCompany = await companyRepository.update({
      companyId,
      companyData: updateData,
    });

    return updatedCompany;
  }

  async deleteCompany(companyId: number) {
    const deletedCompany = await companyRepository.delete(companyId);

    if (!deletedCompany) {
    throw new NotFoundError({ message: `Company with ID ${companyId} not found` });
    }

    return deletedCompany;
  }
}

export default new CompanyService();
