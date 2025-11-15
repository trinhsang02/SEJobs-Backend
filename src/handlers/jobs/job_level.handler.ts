import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";
import JobLevelService from "@/services/jobs/job_level.service";
import { BadRequestError } from "@/utils/errors";
import { createJobLevelSchema } from "@/dtos/job/CreateJobLevel.dto";
import { updateJobLevelSchema } from "@/dtos/job/UpdateJobLevel.dto";

export async function getJobLevels(req: Request, res: Response) {
  const { page, limit, job_id, job_level_ids } = req.query;

  const { data: jobLevels } = await JobLevelService.findAll();
  const pagination = null;

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
  const jobLevelData = validate.schema_validate(createJobLevelSchema, request.body);

  const newJobLevel = await JobLevelService.createJobLevel({ jobLevelData });

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

  const jobLevelData = validate.schema_validate(updateJobLevelSchema, request.body);

  const updatedJobLevel = await JobLevelService.updateJobLevel({
    jobLevelId: _.toNumber(id),
    jobLevelData,
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
