import ApplicationRepository from "@/repositories/application.repository";
import { CreateApplicationDTO, UpdateApplicationStatusDTO } from "@/dtos/user/Application.dto";
import { NotFoundError, ConflictError, BadRequestError } from "@/utils/errors";
import JobRepository from "@/repositories/job.repository";
import CompanyRepository from "@/repositories/company.repository";
import { ApplicationQueryAllParams, ApplicationQueryParams } from "@/types/common";
import { supabase } from "@/config/supabase";
import studentRepository from "@/repositories/student.repository";
import path from "path";
import { MediaService } from "@/services/media.service";
import _ from "lodash";

function toDatabaseFormat<T extends Record<string, any>>(obj: T): any {
  const result: any = {};
  for (const key in obj) {
    result[key] = obj[key] === undefined ? null : obj[key];
  }
  return result;
}

export const ApplicationService = {
  async findAll(params: ApplicationQueryAllParams) {
    return await ApplicationRepository.findAll(params);
  },

  async findOne(params: ApplicationQueryParams) {
    const app = await ApplicationRepository.findOne(params);

    if (!app) throw new NotFoundError({ message: "Application not found" });

    return app;
  },

  async create(payload: CreateApplicationDTO & { user_id: number }) {
    const existing = await ApplicationRepository.findOne({
      user_id: payload.user_id,
      job_id: payload.job_id,
    });

    if (existing) {
      throw new ConflictError({ message: "You have already applied to this job" });
    }

    const { job } = await JobRepository.findOne(payload.job_id);

    if (!job) {
      throw new BadRequestError({ message: "job_id not found for this application!" });
    }

    if (!payload.resume_url) {
      const student = await studentRepository.findOne({ user_id: payload.user_id });

      if (!student || !student.id) {
        throw new BadRequestError({ message: "Invalid user_id!" });
      }

      const { data: cv, error } = await supabase.from("cv").select("*").eq("studentid", student.id).single();

      if (error) throw error;
      const oldFilename = path.basename(cv?.filepath ?? "");

      if (!oldFilename) {
        throw new BadRequestError({ message: "User don't have CV!" });
      }
      
      const { url } = await MediaService.clone(oldFilename);
      payload.resume_url = url;
    }

    if (!payload.resume_url) {
      throw new BadRequestError({ message: "Missing resume_url!" });
    }

    const dbPayload = toDatabaseFormat({
      ...payload,
      company_id: job.company_id
    });

    return ApplicationRepository.create(dbPayload);
  },

  async update(id: number, payload: UpdateApplicationStatusDTO) {
    const dbPayload = toDatabaseFormat({
      ...payload,
      updated_at: new Date()
    });

    return ApplicationRepository.updateStatus(id, dbPayload);
  },

  async delete(id: number) {
    return ApplicationRepository.delete(id);
  },
};
