import { Request, Response } from "express";
import validate from "@/utils/validate";
import { createProjectSchema, updateProjectSchema } from "@/dtos/student/ProjectsCertifications.dto";
import { projectsService } from "@/services/projects.service";
import { UnauthorizedError } from "@/utils/errors";

export async function listProjects(req: Request, res: Response) {
  const { page, limit } = req.query;
  const { data: projects, pagination } = await projectsService.findAll({
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, data: projects, pagination });
}

export async function getProject(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = await projectsService.getOne(id);
  res.status(200).json({ success: true, data });
}

export async function createProject(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });

  const payload = validate.schema_validate(createProjectSchema, req.body);

  if (req.user.role === "Student") {
    payload.student_id = req.user.userId;
  }

  if (req.user.role === "Student" && payload.student_id && payload.student_id !== req.user.userId) {
    throw new UnauthorizedError({ message: "Cannot create project for another student" });
  }

  const created = await projectsService.create(payload);
  res.status(201).json({ success: true, data: created });
}

export async function updateProject(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  const payload = validate.schema_validate(updateProjectSchema, req.body);
  const updated = await projectsService.update(id, payload);
  res.status(200).json({ success: true, data: updated });
}

export async function deleteProject(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const id = Number(req.params.id);
  await projectsService.remove(id);
  res.status(204).send();
}

export async function getProjectsByStudentId(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError({ message: "Authentication required" });
  const studentId = req.user.userId;
  const { page, limit } = req.query;
  const { data: projects, pagination } = await projectsService.findByStudentId(studentId, {
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
  res.status(200).json({ success: true, data: projects, pagination });
}
