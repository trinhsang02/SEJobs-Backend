import skillRepository from "@/repositories/skills.repository";
import { CreateSkillDto } from "@/dtos/job/CreateSkill.dto";
import { SkillQueryParams } from "@/types/common";
import { UpdateSkillDto } from "@/dtos/job/UpdateSkill.dto";

export class SkillService {
  async findAll(input: SkillQueryParams) {
    return await skillRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await skillRepository.findOne(input.id);
  }

  async create(input: { skillData: CreateSkillDto }) {
    const { skillData } = input;

    return await skillRepository.create({
      skillData: skillData,
    });
  }

  async update(input: { skillData: UpdateSkillDto }) {
    const { skillData } = input;

    return await skillRepository.update(skillData.id, {
      name: skillData.name || "",
    });
  }

  async delete(id: number) {
    return await skillRepository.delete(id);
  }
}

export default new SkillService();
