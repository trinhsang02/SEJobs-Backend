import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import JobLevelService from "@/services/job_levels.service";
import { BadRequestError } from "@/utils/errors";
import { updateLevelSchema } from "@/dtos/job/UpdateLevel.dto";
import { createLevelSchema } from "@/dtos/job/CreateLevel.dto";
import convert from "@/utils/convert";

export async function getJobLevels(req: Request, res: Response) {
  const { page, limit, ids } = req.query;

  const { data: jobLevels, pagination } = await JobLevelService.findAll({
    page: _.toInteger(page) || 1,
    limit: _.toInteger(limit) || 10,
    ids: convert.split(ids as string, ",", Number),
  });

  res.status(200).json({
    success: true,
    data: jobLevels,
    pagination,
  });
}

export async function getJobLevel(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  const jobLevel = await JobLevelService.findOne({ id: _.toNumber(id) });

  res.status(200).json({
    success: true,
    data: jobLevel,
  });
}

export async function createJobLevel(request: Request, response: Response) {
  const jobLevelData = validate.schema_validate(createLevelSchema, request.body);

  const newJobLevel = await JobLevelService.create({ jobLevelData });

  response.status(201).json({
    success: true,
    data: newJobLevel,
  });
}

export async function updateJobLevel(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  request.body.id = _.toNumber(id);
  const jobLevelData = validate.schema_validate(updateLevelSchema, request.body);

  const updatedJobLevel = await JobLevelService.update({
    jobLevelData: jobLevelData,
  });

  response.status(200).json({
    success: true,
    data: updatedJobLevel,
  });
}

export async function deleteJobLevel(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  await JobLevelService.deleteJobLevel(_.toNumber(id));

  response.status(200).json({
    success: true,
  });
}
