import { Request, Response } from "express";
import validate from "@/utils/validate";
import { createApplicationSchema, updateApplicationStatusSchema } from "@/dtos/user/Application.dto";
import { ApplicationService } from "@/services/applications.service";
import { UnauthorizedError, NotFoundError, BadRequestError } from "@/utils/errors";
import convert from "@/utils/convert";
import { ApplicationStatus } from "@/types/common";
import _ from "lodash";
import companyService from "@/services/company.service";

export async function listApplications(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });

  const { data, pagination} = await ApplicationService.findAll({ 
    user_id: req.user.userId,
    job_id: _.toNumber(req.query.job_id) || null,
    statuses: convert.split(req.query.statuses as string, ',', String) as ApplicationStatus[],
    page: _.toNumber(req.query.page) || 1,
    limit: _.toNumber(req.query.limit) || 10,
  });

  res.status(200).json({ success: true, data, pagination });
}

export async function getApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });

  const id = Number(req.params.id);

  if (_.isNaN(id)) {
    throw new BadRequestError({ message: "Invalid param id!" });
  }

  const application = await ApplicationService.findOne({ id, user_id: req.user.userId });

  res.status(200).json({ success: true, data: application });
}


export async function createApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });

  const payload = validate.schema_validate(createApplicationSchema, req.body);

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

  const company = await companyService.findOne({
    user_id: req.user.userId,
  });

  const { data, pagination} = await ApplicationService.findAll({ 
    company_id: company.id,
    job_id: _.toNumber(req.query.job_id) || null,
    statuses: convert.split(req.query.statuses as string, ',', String) as ApplicationStatus[],
    page: _.toNumber(req.query.page) || 1,
    limit: _.toNumber(req.query.limit) || 10,
  });

  res.status(200).json({ success: true, data, pagination });
}

// export async function getCompanyApplication(req: Request, res: Response) {
//   if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
//   if (req.user.role !== "Employer") {
//     throw new UnauthorizedError({ message: "Only company can view this application" });
//   }

//   const id = Number(req.params.id);
//   const owns = await verifyCompanyOwnsApplication(req.user.userId, id);
//   if (!owns) {
//     throw new UnauthorizedError({ message: "You do not own this job" });
//   }

//   const app = await ApplicationService.findOne({ id });

//   if (app.status === "Applied") {
//     const updated = await ApplicationService.updateStatus(id, { status: ApplicationStatus.Viewed });
//     res.status(200).json({ success: true, data: updated });
//   } else {
//     res.status(200).json({ success: true, data: app });
//   }
// }

// export async function updateApplicationStatus(req: Request, res: Response) {
//   if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
//   if (req.user.role !== "Employer") {
//     throw new UnauthorizedError({ message: "Only company can update application status" });
//   }

//   const id = Number(req.params.id);
//   const payload = validate.schema_validate(updateApplicationStatusSchema, req.body);

//   const owns = await verifyCompanyOwnsApplication(req.user.userId, id);
//   if (!owns) {
//     throw new UnauthorizedError({ message: "You do not own this job" });
//   }

//   const payloadWithReviewedAt = {
//     ...payload,
//     reviewed_at: payload.reviewed_at || new Date().toISOString(),
//   };

//   const updated = await ApplicationService.updateStatus(id, payloadWithReviewedAt);
//   res.status(200).json({ success: true, data: updated });
// }
// export async function deleteApplication(req: Request, res: Response) {
//   if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
//   const id = Number(req.params.id);

//   const app = await ApplicationService.findOne({ id });
//   if (app.user_id !== req.user.userId && req.user.role !== "Admin") {
//     throw new UnauthorizedError({ message: "You cannot delete this application" });
//   }

//   await ApplicationService.delete(id);
//   res.status(204).send();
// }
