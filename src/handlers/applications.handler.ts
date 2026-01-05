import { Request, Response } from "express";
import validate from "@/utils/validate";
import { createApplicationSchema, updateApplicationSchema } from "@/dtos/user/Application.dto";
import { ApplicationService } from "@/services/applications.service";
import { UnauthorizedError, BadRequestError } from "@/utils/errors";

import { supabase } from "@/config/supabase";

// async function uploadResume(fileBuffer: Buffer, fileName: string): Promise<string> {
//   const fileExt = fileName.split(".").pop()?.toLowerCase() || "pdf";

//   const bucketName = "resumes";

//   const { error } = await supabase.storage.from(bucketName).upload(`public/${uniqueName}`, fileBuffer, {
//     contentType: fileExt === "pdf" ? "application/pdf" : "application/octet-stream",
//     upsert: false,
//   });

//   if (error) throw new BadRequestError({ message: "Failed to upload resume" });

//   const { data } = supabase.storage.from(bucketName).getPublicUrl(`public/${uniqueName}`);
//   return data.publicUrl;
// }

export async function listApplications(req: Request, res: Response) {
  const { page, limit } = req.query;
  const result = await ApplicationService.findAll({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, ...result });
}

export async function getApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  const app = await ApplicationService.getOne(id);

  if (req.user.role !== "Admin" && app.user_id !== req.user.userId) {
    throw new UnauthorizedError({ message: "You cannot view this application" });
  }

  res.status(200).json({ success: true, data: app });
}

export async function createApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });

  const payload = validate.schema_validate(createApplicationSchema, req.body);

  if (!req.file) {
    throw new BadRequestError({ message: "Resume file is required" });
  }

  let resumeUrl = "";
  try {
    // resumeUrl = await uploadResume(req.file.buffer, req.file.originalname);

    const applicationData = {
      ...payload,
      user_id: req.user.userId,
      //   resume_url: resumeUrl,
    };

    const created = await ApplicationService.create(applicationData);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    console.error("Create application error:", error);

    throw new BadRequestError({ message: "Failed to submit application" });
  }
}

export async function updateApplication(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  const payload = validate.schema_validate(updateApplicationSchema, req.body);

  const app = await ApplicationService.getOne(id);
  if (app.user_id !== req.user.userId && req.user.role !== "Admin") {
    throw new UnauthorizedError({ message: "You cannot update this application" });
  }

  const updated = await ApplicationService.update(id, payload);
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

export async function getMyApplications(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const { page, limit } = req.query;
  const result = await ApplicationService.findByUserId(req.user.userId, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, ...result });
}
