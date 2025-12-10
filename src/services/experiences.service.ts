
import { CreateExperienceDTO, UpdateExperienceDTO } from "@/dtos/student/Experiences.dto";
import experiencesRepository from "@/repositories/experiences.repository";
import { ExperienceQueryParams } from "@/types/common";
import { id } from "zod/v4/locales";

export class ExperienceService {
    async findAll(input: ExperienceQueryParams) {
        return await experiencesRepository.findAll(input);
    }

    async findOne(id: number) {
        return await experiencesRepository.findOne(id);
    }

    async create(input: CreateExperienceDTO) {
        return await experiencesRepository.create(input as any);
    }

    async update(input: { id: number; data: UpdateExperienceDTO }) {
        return await experiencesRepository.update(input.id, input.data as any);
    }

    async delete(id: number) {
        return await experiencesRepository.delete(id);
    }
}

export default new ExperienceService();