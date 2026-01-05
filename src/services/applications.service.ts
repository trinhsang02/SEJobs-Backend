import ApplicationRepository from "@/repositories/application.repository";
import { CreateApplicationDTO, UpdateApplicationStatusDTO } from "@/dtos/user/Application.dto";
import { NotFoundError, ConflictError } from "@/utils/errors";

function toDatabaseFormat<T extends Record<string, any>>(obj: T): any {
  const result: any = {};
  for (const key in obj) {
    result[key] = obj[key] === undefined ? null : obj[key];
  }
  return result;
}

export const ApplicationService = {
  async findByUserId(userId: number, options: { page: number; limit: number }) {
    return ApplicationRepository.findByUserId(userId, options);
  },

  async findByCompanyId(companyId: number, options: { page: number; limit: number; jobId?: number }) {
    return ApplicationRepository.findByCompanyId(companyId, options);
  },

  async getOne(id: number) {
    const app = await ApplicationRepository.findOne(id);
    if (!app) throw new NotFoundError({ message: "Application not found" });
    return app;
  },

  async findByUserIdAndJobId(userId: number, jobId: number) {
    return ApplicationRepository.findByUserIdAndJobId(userId, jobId);
  },

  async create(payload: CreateApplicationDTO & { user_id: number }) {
    const existing = await ApplicationRepository.findByUserIdAndJobId(payload.user_id, payload.job_id);
    if (existing) {
      throw new ConflictError({ message: "You have already applied to this job" });
    }

    const dbPayload = toDatabaseFormat(payload);
    return ApplicationRepository.insert(dbPayload);
  },

  async updateStatus(id: number, payload: UpdateApplicationStatusDTO) {
    await this.getOne(id);
    const dbPayload = toDatabaseFormat(payload);
    return ApplicationRepository.updateStatus(id, dbPayload);
  },

  async delete(id: number) {
    await this.getOne(id);
    return ApplicationRepository.delete(id);
  },
};
