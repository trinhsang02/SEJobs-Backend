import experiencesRepository from "@/repositories/experiences.repository";
import { CreateExperienceDTO, UpdateExperienceDTO } from "@/dtos/student/Experience.dto";
import { NotFoundError, BadRequestError } from "@/utils/errors";

export const experiencesService = {
  async findAll(options: { page: number; limit: number }) {
    return experiencesRepository.findAll(options);
  },

  async findByStudentId(studentId: number, options: { page: number; limit: number }) {
    return experiencesRepository.findByStudentId(studentId, options);
  },

  async getOne(id: number) {
    const rec = await experiencesRepository.findOne(id);
    if (!rec) throw new NotFoundError({ message: "Experience not found" });
    return rec;
  },

  async create(payload: CreateExperienceDTO) {
    if (!payload.company || !payload.position || !payload.start_date)
      throw new BadRequestError({ message: "company, position, and start_date are required" });
    return experiencesRepository.insert(payload as any);
  },

  async update(id: number, payload: UpdateExperienceDTO) {
    await this.getOne(id);
    return experiencesRepository.update(id, payload as any);
  },

  async remove(id: number) {
    await this.getOne(id);
    return experiencesRepository.remove(id);
  },
};
