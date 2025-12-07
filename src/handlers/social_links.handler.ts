// handlers/socialLink.handler.ts
import { Request, Response } from "express";

import validate from "@/utils/validate";

import { BadRequestError } from "@/utils/errors";
import social_linksService from "@/services/social_links.service";
import { createSocialLinkSchema, updateSocialLinkSchema } from "@/dtos/student/SocialLinks.dto";
import studentRepository from "@/repositories/student.repository";

export async function createSocialLink(req: Request, res: Response) {
  const userId = req.user!.userId;
  const linkData = validate.schema_validate(createSocialLinkSchema, req.body);

  const student = await studentRepository.findOne({ user_id: userId });
  if (!student) {
    throw new BadRequestError({ message: "Student profile not found" });
  }

  const created = await social_linksService.create({
    student_id: student.id,
    userId,
    linkData,
  });

  res.status(201).json({ success: true, created });
}

export async function updateSocialLink(req: Request, res: Response) {
  const userId = req.user!.userId;
  const platform = req.params.platform;
  const linkData = validate.schema_validate(updateSocialLinkSchema, req.body);

  if (!platform) {
    throw new BadRequestError({ message: "platform is required" });
  }

  const student = await studentRepository.findOne({ user_id: userId });
  if (!student) {
    throw new BadRequestError({ message: "Student profile not found" });
  }

  const updated = await social_linksService.update({
    student_id: student.id,
    userId,
    platform,
    linkData,
  });

  res.status(200).json({ success: true, updated });
}

export async function deleteSocialLink(req: Request, res: Response) {
  console.log("✅ listSocialLinks START");
  const userId = req.user!.userId;
  const platform = req.params.platform;

  if (!platform) {
    throw new BadRequestError({ message: "platform is required" });
  }

  const student = await studentRepository.findOne({ user_id: userId });
  if (!student) {
    throw new BadRequestError({ message: "Student profile not found" });
  }

  await social_linksService.delete({
    student_id: student.id,
    userId,
    platform,
  });

  res.status(200).json({ success: true, message: "Social link deleted" });
}

export async function listSocialLinks(req: Request, res: Response) {
  const userId = req.user!.userId;

  const student = await studentRepository.findOne({ user_id: userId });
  if (!student || student.id == null) {
    throw new BadRequestError({ message: "Student profile not found" });
  }

  const student_id = Number(student.id);
  if (isNaN(student_id) || student_id <= 0) {
    throw new BadRequestError({ message: "Invalid student ID" });
  }

  const links = await social_linksService.list({ student_id, userId });
  res.status(200).json({ success: true, links });
}
