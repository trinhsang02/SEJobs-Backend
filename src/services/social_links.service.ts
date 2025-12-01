// services/socialLink.service.ts

import { BadRequestError, NotFoundError } from "@/utils/errors";
import studentRepo from "@/repositories/student.repository"; // to verify student ownership
import { CreateSocialLinkDto, UpdateSocialLinkDto } from "@/dtos/student/SocialLinks.dto";
import social_linksRepository from "@/repositories/social_links.repository";

export class SocialLinkService {
  async assertStudentOwnership(student_id: number, userId: number) {
    const student = await studentRepo.findOne({ student_id });
    console.log("DEBUG assertStudentOwnership student:", student);
    if (!student) {
      throw new NotFoundError({ message: "Student profile not found" });
    }
    if (student.user_id !== userId) {
      throw new BadRequestError({ message: "You do not own this student profile" });
    }
  }

  async create(input: { student_id: number; userId: number; linkData: CreateSocialLinkDto }) {
    const { student_id, userId, linkData } = input;

    await this.assertStudentOwnership(student_id, userId);

    const existing = await social_linksRepository.findOne(student_id, linkData.platform);
    if (existing) {
      throw new BadRequestError({ message: `Link for ${linkData.platform} already exists` });
    }

    return await social_linksRepository.create({
      student_id,
      platform: linkData.platform,
      url: linkData.url,
    });
  }

  async update(input: { student_id: number; userId: number; platform: string; linkData: UpdateSocialLinkDto }) {
    const { student_id, userId, platform, linkData } = input;

    await this.assertStudentOwnership(student_id, userId);

    const existing = await social_linksRepository.findOne(student_id, platform);
    if (!existing) {
      throw new NotFoundError({ message: `Social link for ${platform} not found` });
    }

    return await social_linksRepository.update(student_id, platform, linkData);
  }

  async delete(input: { student_id: number; userId: number; platform: string }) {
    const { student_id, userId, platform } = input;

    await this.assertStudentOwnership(student_id, userId);

    await social_linksRepository.delete(student_id, platform);
  }

  async list(input: { student_id: number; userId: number }) {
    const { student_id, userId } = input;
    console.log("DEBUG list input:", input);
    await this.assertStudentOwnership(student_id, userId);

    const { data: links } = await social_linksRepository.findAll({ student_id });
    return links;
  }
}

export default new SocialLinkService();
