import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import JobCategoryService from "@/services/jobs/job_category.service";
import { BadRequestError } from "@/utils/errors";

export async function getJobCategories(req: Request, res: Response) {
  const { page, limit, job_id, category_ids } = req.query;

  const { data: jobCategories, pagination } = await JobCategoryService.findAll({
    page: _.toInteger(page) || 1,
    limit: _.toInteger(limit) || 10,
    job_id: _.toNumber(job_id),
    category_ids: typeof category_ids === "string" ? category_ids.split(",").map(Number) : [],
  });

  res.status(200).json({
    success: true,
    data: jobCategories,
    pagination,
  });
}

export async function getJobCategory(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  const jobCategory = await JobCategoryService.findOne({ id: _.toNumber(id) });

  res.status(200).json({
    success: true,
    data: jobCategory,
  });
}

import { createJobCategorySchema } from "@/dtos/job/CreateJobCategory.dto";

export async function createJobCategory(request: Request, response: Response) {
  const jobCategoryData = validate.schema_validate(createJobCategorySchema, request.body);

  const newJobCategory = await JobCategoryService.createJobCategory({ jobCategoryData });

  response.status(201).json({
    success: true,
    data: newJobCategory,
  });
}

import { updateJobCategorySchema } from "@/dtos/job/UpdateJobCategory.dto";

export async function updateJobCategory(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  const jobCategoryData = validate.schema_validate(updateJobCategorySchema, request.body);

  const updatedJobCategory = await JobCategoryService.updateJobCategory({
    jobCategoryId: _.toNumber(id),
    jobCategoryData,
  });

  response.status(200).json({
    success: true,
    data: updatedJobCategory,
  });
}

export async function deleteJobCategory(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  await JobCategoryService.deleteJobCategory(_.toNumber(id));

  response.status(200).json({
    success: true,
  });
}
