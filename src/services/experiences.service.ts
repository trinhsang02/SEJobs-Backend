import { CreateExperienceDTO, UpdateExperienceDTO } from "@/dtos/student/Experiences.dto";
import experiencesRepository from "@/repositories/experiences.repository";
import { ExperienceQueryParams } from "@/types/common";
import { NotFoundError, BadRequestError } from "@/utils/errors";

export class ExperienceService {
    async findAll(input: ExperienceQueryParams) {
        return await experiencesRepository.findAll(input);
    }

    async findOne(id: number) {
        const respond = await experiencesRepository.findOne(id);
        if (!respond) {
            throw new NotFoundError({ message: "Experience not found"});
        }
        return respond;
    }

    async create(input: CreateExperienceDTO) {
      if (!input.company || !input.position || !input.start_date)
        throw new BadRequestError({ message: "company, position, and start_date are required" });
      return await experiencesRepository.create(input as any);
    }

    async update(input: { id: number; data: UpdateExperienceDTO }) {
      await this.findOne(input.id);
      return await experiencesRepository.update(input.id, input.data as any);
    }

    async delete(id: number) {
      await this.findOne(id);
      return await experiencesRepository.delete(id);
    }
}

export default new ExperienceService();