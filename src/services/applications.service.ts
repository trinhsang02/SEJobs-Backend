import ApplicationRepository from "@/repositories/application.repository";
import { CreateApplicationDTO, UpdateApplicationDTO } from "@/dtos/user/Application.dto";
import { NotFoundError, BadRequestError, ConflictError } from "@/utils/errors";

export const ApplicationService = {
  async findAll(options: { page: number; limit: number }) {
    return ApplicationRepository.findAll(options);
  },

  async findByUserId(userId: number, options: { page: number; limit: number }) {
    return ApplicationRepository.findByUserId(userId, options);
  },

  async getOne(id: number) {
    const app = await ApplicationRepository.findOne(id);
    if (!app) throw new NotFoundError({ message: "Application not found" });
    return app;
  },

  async create(payload: CreateApplicationDTO & { user_id: number }) {
    const { user_id, job_id } = payload;

    const existing = await ApplicationRepository.findByUserIdAndJobId(user_id, job_id);
    if (existing) {
      throw new ConflictError({ message: "You have already applied to this job" });
    }

    return ApplicationRepository.insert(payload as any);
  },

  async update(id: number, payload: UpdateApplicationDTO) {
    await this.getOne(id);
    return ApplicationRepository.update(id, payload as any);
  },

  async delete(id: number) {
    await this.getOne(id);
    return ApplicationRepository.delete(id);
  },
};
