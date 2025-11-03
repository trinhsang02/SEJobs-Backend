import { Request, Response } from "express";
import jobService from "@/services/jobs.service";
import { BadRequestError } from "@/utils/errors";

/**
 * Handlers for jobs endpoints
 *
 * Routes:
 * - GET    /api/v1/jobs
 * - GET    /api/v1/jobs/:id
 * - POST   /api/v1/jobs
 * - PUT    /api/v1/jobs/:id
 * - DELETE /api/v1/jobs/:id
 */

export async function listJobs(req: Request, res: Response) {
  const query = req.query;
  const result = await jobService.list(query as any);
  return res.status(200).json({ success: true, data: result });
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
  const jobData = req.body;
  const created = await jobService.create({ jobData });
  return res.status(201).json({ success: true, data: created });
}

export async function updateJob(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new BadRequestError({ message: "Invalid job id" });
  }
  const jobData = req.body;
  const updated = await jobService.update({ jobId: id, jobData });
  return res.status(200).json({ success: true, data: updated });
}

export async function deleteJob(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new BadRequestError({ message: "Invalid job id" });
  }
  const deleted = await jobService.delete({ jobId: id });
  return res.status(200).json({ success: true, data: deleted });
}
