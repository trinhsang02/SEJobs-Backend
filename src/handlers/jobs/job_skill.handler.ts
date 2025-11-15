import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";

import { BadRequestError } from "@/utils/errors";
import JobSkillService from "@/services/jobs/job_skill.service";

export async function getJobSkills(req: Request, res: Response) {
  const { page, limit, job_id, required_skill_ids } = req.query;

  const { data: jobSkills, pagination } = await JobSkillService.findAll({
    page: _.toInteger(page) || 1,
    limit: _.toInteger(limit) || 10,
    job_id: _.toNumber(job_id),
    required_skill_ids: typeof required_skill_ids === "string" ? required_skill_ids.split(",").map(Number) : [],
  });

  res.status(200).json({
    success: true,
    data: jobSkills,
    pagination,
  });
}

export async function getJobSkill(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  const jobSkill = await JobSkillService.findOne({ id: _.toNumber(id) });

  res.status(200).json({
    success: true,
    data: jobSkill,
  });
}

export async function createJobSkill(request: Request, response: Response) {
  const jobSkillData = request.body; // Add validation if needed

  const newJobSkill = await JobSkillService.createJobSkill({ jobSkillData });

  response.status(201).json({
    success: true,
    data: newJobSkill,
  });
}

export async function updateJobSkill(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  const jobSkillData = request.body; // Add validation if needed

  const updatedJobSkill = await JobSkillService.updateJobSkill({ jobSkillId: _.toNumber(id), jobSkillData });

  response.status(200).json({
    success: true,
    data: updatedJobSkill,
  });
}

export async function deleteJobSkill(request: Request, response: Response) {
  const id = request.params.id;
  if (!id) {
    throw new BadRequestError({ message: "Missing required param: id" });
  }

  await JobSkillService.deleteJobSkill(_.toNumber(id));

  response.status(200).json({
    success: true,
  });
}
