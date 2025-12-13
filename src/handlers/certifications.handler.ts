import { Request, Response } from "express";
import validate from "@/utils/validate";
import { createCertificationSchema, updateCertificationSchema } from "@/dtos/student/ProjectsCertifications.dto";
import { certificationsService } from "@/services/certifications.service";
import { BadRequestError, UnauthorizedError } from "@/utils/errors";
import studentRepository from "@/repositories/student.repository";

export async function listCertifications(req: Request, res: Response) {
  const { page, limit } = req.query;
  const { data: certifications, pagination } = await certificationsService.findAll({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, data: certifications, pagination });
}

export async function getCertification(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await certificationsService.getOne(id);
  res.status(200).json({ success: true, data });
}

export async function createCertification(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  if (req.user.role !== "Student") {
    throw new UnauthorizedError({ message: "Only students can create certifications" });
  }

  const payload = validate.schema_validate(createCertificationSchema, req.body);

  const student = await studentRepository.findByUserId(req.user.userId);
  if (!student) {
    throw new BadRequestError({ message: "Student profile not found" });
  }

  const finalPayload = {
    ...payload,
    student_id: student.id,
  };

  const created = await certificationsService.create(finalPayload);
  res.status(201).json({ success: true, data: created });
}

export async function updateCertification(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  const payload = validate.schema_validate(updateCertificationSchema, req.body);
  const updated = await certificationsService.update(id, payload);
  res.status(200).json({ success: true, data: updated });
}

export async function deleteCertification(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  await certificationsService.remove(id);
  res.status(204).send();
}

export async function getCertificationsByStudentId(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  if (req.user.role !== "Student") {
    throw new UnauthorizedError({ message: "Only students have certifications" });
  }

  const student = await studentRepository.findByUserId(req.user.userId);
  if (!student) {
    return res.status(200).json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0 } });
  }

  const { page, limit } = req.query;
  const { data: certifications, pagination } = await certificationsService.findByStudentId(student.id, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, data: certifications, pagination });
}
