import { Request, Response } from "express";
import validate from "@/utils/validate";
import { createExperienceSchema, updateExperienceSchema } from "@/dtos/student/Experience.dto";
import { experiencesService } from "@/services/experiences.service";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";
import studentRepository from "@/repositories/student.repository";

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

  if (req.user.role !== "Student") {
    throw new UnauthorizedError({ message: "Only students can create experiences" });
  }

  const payload = validate.schema_validate(createExperienceSchema, req.body);

  const student = await studentRepository.findByUserId(req.user.userId);
  if (!student) {
    throw new BadRequestError({ message: "Student profile not found" });
  }

  const finalPayload = {
    ...payload,
    student_id: student.id,
  };

  const created = await experiencesService.create(finalPayload);
  res.status(201).json({ success: true, created });
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
  if (req.user.role !== "Student") {
    throw new UnauthorizedError({ message: "Only students have experiences" });
  }

  const student = await studentRepository.findByUserId(req.user.userId);
  if (!student) {
    return res.status(200).json({
      success: true,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
    });
  }

  const { page, limit } = req.query;
  const { data: experiences, pagination } = await experiencesService.findByStudentId(student.id, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, data: experiences, pagination });
}
