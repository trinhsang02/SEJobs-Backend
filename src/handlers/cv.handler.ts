import { Request, Response } from "express-serve-static-core";
import validate from "@/utils/validate";

import { CVService } from "@/services/cv.service";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";
import { createCvSchema, updateCvSchema } from "@/dtos/student/Cv.dto";
import CVRepository from "@/repositories/cv.repository";
import studentRepository from "@/repositories/student.repository";

export async function getCVs(req: Request, res: Response) {
  const { page = "1", limit = "10" } = req.query;
  const data = await CVService.findAll({ page: Number(page), limit: Number(limit) });
  res.status(200).json({ success: true, ...data });
}

export async function getCVByStudentId(req: Request, res: Response) {
  const { studentId } = req.params;
  const id = Number(studentId);
  if (!id) throw new BadRequestError({ message: "Invalid student ID" });
  const { page = "1", limit = "10" } = req.query;
  const data = await CVService.findByStudentId(id, { page: Number(page), limit: Number(limit) });
  res.status(200).json({ success: true, ...data });
}

export async function createCV(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  if (req.user.role !== "Student") {
    throw new UnauthorizedError({ message: "Only students can create certifications" });
  }

  const payload = validate.schema_validate(createCvSchema, req.body);

  const student = await studentRepository.findByUserId(req.user.userId);
  if (!student) {
    throw new UnauthorizedError({ message: "Student profile not found" });
  }

  const finalPayload = {
    ...payload,
    studentid: student.id,
  };
  console.log("finalPayload", finalPayload);
  const created = await CVService.create(finalPayload);
  res.status(201).json({ success: true, created });
}

export async function updateCV(req: Request, res: Response) {
  const { cvId } = req.params;
  const id = Number(cvId);
  if (!id) throw new BadRequestError({ message: "Invalid CV ID" });
  const cvData = validate.schema_validate(updateCvSchema, req.body);
  const cv = await CVService.update(id, cvData);
  res.status(200).json({ success: true, data: cv });
}

export async function deleteCV(req: Request, res: Response) {
  const { cvId } = req.params;
  const id = Number(cvId);
  if (!id) throw new BadRequestError({ message: "Invalid CV ID" });
  await CVService.remove(id);
  res.status(200).json({ success: true, message: "CV deleted successfully" });
}
