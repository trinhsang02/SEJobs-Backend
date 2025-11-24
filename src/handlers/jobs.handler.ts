import { Request, Response } from "express";
import jobService from "@/services/jobs.service";
import { BadRequestError } from "@/utils/errors";
import _ from "lodash";
import validate from "@/utils/validate";
import { createJobSchema } from "@/dtos/job/CreateJob.dto";
import { updateJobSchema } from "@/dtos/job/UpdateJob.dto";
import { SORTABLE_JOB_FIELDS, SortableJobFields } from "@/types/common";

export async function listJobs(req: Request, res: Response) {
  const page = _.toInteger(req.query.page) || 1;
  const limit = _.toInteger(req.query.limit) || 10;
  const order = req.query.order === "asc" ? "asc" : "desc";
  const sort_by =
    typeof req.query.sort_by === "string" && (SORTABLE_JOB_FIELDS as readonly string[]).includes(req.query.sort_by)
      ? (req.query.sort_by as SortableJobFields)
      : undefined;
  const filters = { ...req.query };

  const { data: jobs, pagination } = await jobService.list({
    ...req.query,
    page,
    limit,
    sort_by: typeof sort_by === "string" ? (sort_by as any) : undefined,
    order,
  });

  res.status(200).json({
    success: true,
    data: jobs,
    pagination,
  });
}

export async function getJob(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    throw new BadRequestError({ message: "Invalid job id" });
  }

  const job = await jobService.findOne({ jobId: id });

  return res.status(200).json({ success: true, data: job });
}

export async function createJob(req: Request, res: Response) {
  const jobData = validate.schema_validate(createJobSchema, req.body);

  const created_job = await jobService.create({ jobData });

  res.status(201).json({
    success: true,
    data: created_job,
  });
}

export async function updateJob(req: Request, res: Response) {
  const id = _.toNumber(req.params.id);

  if (!id) {
    throw new BadRequestError({ message: "Invalid job id" });
  }

  const jobData = validate.schema_validate(updateJobSchema, req.body);

  const updated_job = await jobService.update({ jobId: id, jobData });

  res.status(200).json({
    success: true,
    data: updated_job,
  });
}

export async function deleteJob(req: Request, res: Response) {
  const id = _.toNumber(req.params.id);

  if (!id) {
    throw new BadRequestError({ message: "Invalid job id" });
  }

  await jobService.delete(id);

  res.status(200).json({
    success: true,
  });
}
