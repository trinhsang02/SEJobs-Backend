import { Request, Response } from "express";
import validate from "@/utils/validate";
import { createExperienceSchema, updateExperienceSchema } from "@/dtos/student/Experience.dto";
import { experiencesService } from "@/services/experiences.service";
import { UnauthorizedError } from "@/utils/errors";

export async function listExperiences(req: Request, res: Response) {
  const { page, limit } = req.query;
  const { data: experiences, pagination } = await experiencesService.findAll({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, data: experiences, pagination });
}

export async function getExperience(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await experiencesService.getOne(id);
  res.status(200).json({ success: true, data });
}

export async function createExperience(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });

  const payload = validate.schema_validate(createExperienceSchema, req.body);

  if (req.user.role === "Student") {
    payload.student_id = req.user.userId;
  }

  if (req.user.role === "Student" && payload.student_id && payload.student_id !== req.user.userId) {
    throw new UnauthorizedError({ message: "Cannot create experience for another student" });
  }

  const created = await experiencesService.create(payload);
  res.status(201).json({ success: true, data: created });
}

export async function updateExperience(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  const payload = validate.schema_validate(updateExperienceSchema, req.body);
  const updated = await experiencesService.update(id, payload);
  res.status(200).json({ success: true, data: updated });
}

export async function deleteExperience(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  await experiencesService.remove(id);
  res.status(204).send();
}

export async function getExperiencesByStudentId(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const studentId = req.user.userId;
  const { page, limit } = req.query;
  const { data: experiences, pagination } = await experiencesService.findByStudentId(studentId, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, data: experiences, pagination });
}
