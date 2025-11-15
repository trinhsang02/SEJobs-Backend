import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import JobEmploymentTypeService from "@/services/jobs/job_employment_type.service";
import { BadRequestError } from "@/utils/errors";
import { createJobEmploymentTypeSchema } from "@/dtos/job/CreateJobEmploymentType.dto";
import { updateJobEmploymentTypeSchema } from "@/dtos/job/UpdateJobEmploymentType.dto";

export async function getJobEmploymentTypes(req: Request, res: Response) {
  const { page, limit, job_id, employment_type_ids } = req.query;

  const { data: jobEmploymentTypes, pagination } = await JobEmploymentTypeService.findAll({
    page: _.toInteger(page) || 1,
    limit: _.toInteger(limit) || 10,
    job_id: _.toNumber(job_id),
    employment_type_ids: typeof employment_type_ids === "string" ? employment_type_ids.split(",").map(Number) : [],
  });

  res.status(200).json({
    success: true,
    data: jobEmploymentTypes,
    pagination,
  });
}

export async function getJobEmploymentType(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  const jobEmploymentType = await JobEmploymentTypeService.findOne({ id: _.toNumber(id) });

  res.status(200).json({
    success: true,
    data: jobEmploymentType,
  });
}

export async function createJobEmploymentType(request: Request, response: Response) {
  const jobEmploymentTypeData = validate.schema_validate(createJobEmploymentTypeSchema, request.body);

  const newJobEmploymentType = await JobEmploymentTypeService.createJobEmploymentType({ jobEmploymentTypeData });

  response.status(201).json({
    success: true,
    data: newJobEmploymentType,
  });
}

export async function updateJobEmploymentType(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  const jobEmploymentTypeData = validate.schema_validate(updateJobEmploymentTypeSchema, request.body);

  const updatedJobEmploymentType = await JobEmploymentTypeService.updateJobEmploymentType({
    jobEmploymentTypeId: _.toNumber(id),
    jobEmploymentTypeData,
  });

  response.status(200).json({
    success: true,
    data: updatedJobEmploymentType,
  });
}

export async function deleteJobEmploymentType(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  await JobEmploymentTypeService.deleteJobEmploymentType(_.toNumber(id));

  response.status(200).json({
    success: true,
  });
}
