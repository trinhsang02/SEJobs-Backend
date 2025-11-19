import _ from "lodash";
import validate from "@/utils/validate";
import { Request, Response } from "express-serve-static-core";

import { BadRequestError } from "@/utils/errors";
import SkillService from "@/services/required_skills.service";
import { createSkillSchema } from "@/dtos/job/CreateSkill.dto";
import { updateSkillSchema } from "@/dtos/job/UpdateSkill.dto";
import convert from "@/utils/convert";

export async function getJobSkills(req: Request, res: Response) {
  const { page, limit, ids } = req.query;

  const { data: jobSkills, pagination } = await SkillService.findAll({
    page: _.toInteger(page) || 1,
    limit: _.toInteger(limit) || 10,
    ids: convert.split(ids as string, ",", Number),
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

  const jobSkill = await SkillService.findOne({ id: _.toNumber(id) });

  res.status(200).json({
    success: true,
    data: jobSkill,
  });
}

export async function createJobSkill(request: Request, response: Response) {
  const skillData = validate.schema_validate(createSkillSchema, request.body);

  const newJobSkill = await SkillService.create({
    skillData,
  });

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
  request.body.id = id;
  const skillData = validate.schema_validate(updateSkillSchema, request.body);

  const updatedJobSkill = await SkillService.update({ skillData });

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

  await SkillService.deleteSkill(_.toNumber(id));

  response.status(200).json({
    success: true,
  });
}
