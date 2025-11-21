import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import { createCompanySchema } from "@/dtos/company/CreateCompany.dto";
import CompanyService from "@/services/company.service";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import { updateCompanySchema } from "@/dtos/company/UpdateCompany.dto";

export async function getCompanies(req: Request, res: Response) {
  const { page, limit } = req.query;

  const { data: companies, pagination } = await CompanyService.findAll({
    page: _.toInteger(page) || 1,
    limit: _.toInteger(limit) || 10,
  });

  res.status(200).json({
    success: true,
    data: companies,
    pagination,
  });
}

export async function getCompany(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError({ message: 'Missing required param: id'});
  }

  const company = await CompanyService.findOne({ company_id: _.toNumber(id) });

  res.status(200).json({
    success: true,
    data: company,
  });
}

export async function createCompany(request: Request, response: Response) {

  const companyData = validate.schema_validate(createCompanySchema, request.body);    

  const newCompany = await CompanyService.createCompany({ companyData });

  response.status(201).json({
    success: true,
    data: newCompany
  });
}

export async function updateCompany(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: 'Missing required param: id'});
  }

  const companyData = validate.schema_validate(updateCompanySchema, request.body);

  const updatedCompany = await CompanyService.updateCompany({ companyId: _.toNumber(id), companyData: companyData });

  response.status(200).json({
    success: true,
    data: updatedCompany,
  });
}

export async function deleteCompany(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: 'Missing required param: id'});
  }

  await CompanyService.delete(_.toNumber(id));

  response.status(200).json({
    success: true,
  });
}
