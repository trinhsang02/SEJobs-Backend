import { Request, Response } from "express";
import jobService from "@/services/jobs.service";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import _ from "lodash";
import validate from "@/utils/validate";
import { createJobSchema } from "@/dtos/job/CreateJob.dto";
import { updateJobSchema } from "@/dtos/job/UpdateJob.dto";
import { SORTABLE_JOB_FIELDS, SortableJobFields } from "@/types/common";
import { companyJobQuerySchema } from "@/dtos/company/CompanyJobQuery.dto";
import { toTopCvFormat } from "@/utils/topCVFormat";
import { toCamelCaseKeys } from "@/utils/casing";
import convert from "@/utils/convert";
import { TOPCV_ID_TO_MY_PROVINCE_ID } from "@/utils/cityMapper";

export async function listJobs(req: Request, res: Response) {
  const page = _.toInteger(req.query.page) || 1;
  const limit = _.toInteger(req.query.limit) || 10;

  let province_ids: number[] = [];

  if (req.query.city_id) {
    const cityIds = convert.split(req.query.city_id as string, ",", Number).filter((id) => !isNaN(id));
    const mapped = cityIds.map((cvId) => TOPCV_ID_TO_MY_PROVINCE_ID[cvId]).filter((id): id is number => id != null);

    if (cityIds.length > 0 && mapped.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
      });
    }
    province_ids = mapped;
  } else if (req.query.province_id) {
    province_ids = convert.split(req.query.province_id as string, ",", Number).filter((id) => !isNaN(id));
  }

  const level_ids = convert.split(req.query.level_ids as string, ",", Number);
  const skill_ids = convert.split(req.query.skill_ids as string, ",", Number);
  const employment_type_ids = convert.split(req.query.employment_type_ids as string, ",", Number);
  const category_ids = convert.split(req.query.category_ids as string, ",", Number);
  const order = req.query.order === "asc" ? "asc" : "desc";
  const sort_by =
    typeof req.query.sort_by === "string" && (SORTABLE_JOB_FIELDS as readonly string[]).includes(req.query.sort_by)
      ? (req.query.sort_by as SortableJobFields)
      : undefined;

  const { data: jobs, pagination } = await jobService.list({
    province_ids,
    level_ids,
    category_ids,
    employment_type_ids,
    skill_ids,
    salary_from: Number(req.query.salary_from),
    salary_to: Number(req.query.salary_to),
    page,
    limit,
    sort_by: sort_by as any,
    order,
  });

  const formattedJobs = jobs.map((job) => toTopCvFormat(job, job.company, null));

  res.status(200).json({
    success: true,
    data: formattedJobs,
    pagination,
  });
}
export async function getJob(req: Request, res: Response) {
  const id = Number(req.params.id);
  const formatTopCv = req.query.formatTopCv === 'true';

  if (Number.isNaN(id)) {
    throw new BadRequestError({ message: "Invalid job id" });
  }

  const job = await jobService.findOne({ jobId: id });
  if (!job) {
    throw new NotFoundError({ message: "Job not found" });
  }

  let responseData = job;
  if (formatTopCv) {
    responseData = toTopCvFormat(job, job.company, null);
  }

  return res.status(200).json({ success: true, data: responseData });
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

export async function listJobsByCompany(req: Request, res: Response) {
  const companyId = _.toInteger(req.params.id);
  if (!companyId) {
    throw new BadRequestError({ message: "Invalid company ID" });
  }

  const { page, limit } = validate.schema_validate(companyJobQuerySchema, req.query);

  const result = await jobService.listByCompany({ companyId, page, limit });

  res.status(200).json({
    success: true,
    ...result,
  });
}
