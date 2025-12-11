import certificationsRepository from "@/repositories/certifications.repository";
import { CreateCertificationDTO, UpdateCertificationDTO } from "@/dtos/student/ProjectsCertifications.dto";
import { NotFoundError, BadRequestError } from "@/utils/errors";

export const certificationsService = {
  async findAll(options: { page: number; limit: number }) {
    return certificationsRepository.findAll(options);
  },

  async findByStudentId(studentId: number, options: { page: number; limit: number }) {
    return certificationsRepository.findByStudentId(studentId, options);
  },

  async getOne(id: number) {
    const rec = await certificationsRepository.findOne(id);
    if (!rec) throw new NotFoundError({ message: "Certification not found" });
    return rec;
  },

  async create(payload: CreateCertificationDTO) {
    if (!payload.name || !payload.organization)
      throw new BadRequestError({ message: "name and organization are required" });
    return certificationsRepository.insert(payload as any);
  },

  async update(id: number, payload: UpdateCertificationDTO) {
    await this.getOne(id);
    return certificationsRepository.update(id, payload as any);
  },

  async remove(id: number) {
    await this.getOne(id);
    return certificationsRepository.remove(id);
  },
};
