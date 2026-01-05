import { Request, Response } from "express";
import validate from "@/utils/validate";
import { createApplicationSchema, updateApplicationStatusSchema } from "@/dtos/user/Application.dto";
import { ApplicationService } from "@/services/applications.service";
import { UnauthorizedError, NotFoundError, BadRequestError } from "@/utils/errors";
import { supabase } from "@/config/supabase";
import { ApplicationStatus } from "@/types/common";

async function verifyCompanyOwnsApplication(companyUserId: number, applicationId: number) {
  const { data: app } = await supabase.from("applications").select("job_id").eq("id", applicationId).single();

  if (!app) throw new NotFoundError({ message: "Application not found" });

  const { data: job } = await supabase.from("jobs").select("company_id").eq("id", app.job_id).single();

  if (!job) throw new NotFoundError({ message: "Job not found" });

  const { data: company } = await supabase.from("companies").select("id").eq("user_id", companyUserId).single();

  if (!company || company.id !== job.company_id) {
    return false;
  }

  return true;
}

export async function getMyApplications(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const { page = 1, limit = 10 } = req.query;
  const result = await ApplicationService.findByUserId(req.user.userId, {
    page: Number(page),
    limit: Number(limit),
  });
  res.status(200).json({ success: true, ...result });
}

export async function createApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  if (req.user.role !== "Student") {
    throw new UnauthorizedError({ message: "Only students can apply" });
  }

  const payload = validate.schema_validate(createApplicationSchema, req.body);

  const existing = await ApplicationService.findByUserIdAndJobId(req.user.userId, payload.job_id);
  if (existing) {
    throw new BadRequestError({ message: "You have already applied to this job" });
  }

  const applicationData = {
    ...payload,
    user_id: req.user.userId,
  };

  const created = await ApplicationService.create(applicationData);
  res.status(201).json({ success: true, data: created });
}

// --- Company Routes ---

export async function listCompanyApplications(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  if (req.user.role !== "Employer") {
    throw new UnauthorizedError({ message: "Only company can view applications" });
  }

  const { data: company } = await supabase.from("companies").select("id").eq("user_id", req.user.userId).single();

  if (!company) {
    throw new UnauthorizedError({ message: "Company profile not found" });
  }

  const { page = 1, limit = 10, job_id } = req.query;

  const options: { page: number; limit: number; jobId?: number } = {
    page: Number(page),
    limit: Number(limit),
  };

  const jobIdNum = job_id ? Number(job_id) : NaN;
  if (!isNaN(jobIdNum)) {
    options.jobId = jobIdNum;
  }

  const result = await ApplicationService.findByCompanyId(company.id, options);
  res.status(200).json({ success: true, ...result });
}

export async function getCompanyApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  if (req.user.role !== "Employer") {
    throw new UnauthorizedError({ message: "Only company can view this application" });
  }

  const id = Number(req.params.id);
  const owns = await verifyCompanyOwnsApplication(req.user.userId, id);
  if (!owns) {
    throw new UnauthorizedError({ message: "You do not own this job" });
  }

  const app = await ApplicationService.getOne(id);

  if (app.status === "Applied") {
    const updated = await ApplicationService.updateStatus(id, { status: ApplicationStatus.Viewed });
    res.status(200).json({ success: true, data: updated });
  } else {
    res.status(200).json({ success: true, data: app });
  }
}

export async function updateApplicationStatus(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  if (req.user.role !== "Employer") {
    throw new UnauthorizedError({ message: "Only company can update application status" });
  }

  const id = Number(req.params.id);
  const payload = validate.schema_validate(updateApplicationStatusSchema, req.body);

  const owns = await verifyCompanyOwnsApplication(req.user.userId, id);
  if (!owns) {
    throw new UnauthorizedError({ message: "You do not own this job" });
  }

  const payloadWithReviewedAt = {
    ...payload,
    reviewed_at: payload.reviewed_at || new Date().toISOString(),
  };

  const updated = await ApplicationService.updateStatus(id, payloadWithReviewedAt);
  res.status(200).json({ success: true, data: updated });
}
export async function deleteApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);

  const app = await ApplicationService.getOne(id);
  if (app.user_id !== req.user.userId && req.user.role !== "Admin") {
    throw new UnauthorizedError({ message: "You cannot delete this application" });
  }

  await ApplicationService.delete(id);
  res.status(204).send();
}
