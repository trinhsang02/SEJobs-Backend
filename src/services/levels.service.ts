import { CreateLevelDto } from "@/dtos/job/CreateLevel.dto";
import { UpdateLevelDto } from "@/dtos/job/UpdateLevel.dto";
import levelRepository from "@/repositories/level.repository";
import { LevelQueryParams } from "@/types/common";

export class LevelService {
  async findAll(input: LevelQueryParams) {
    return await levelRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await levelRepository.findOne(input.id);
  }

  async create(input: { levelData: CreateLevelDto }) {
    const { levelData } = input;

    return await levelRepository.create({
      levelData: levelData,
    });
  }

  async update(input: { levelData: UpdateLevelDto }) {
    const { levelData } = input;

    return await levelRepository.update(levelData.id, {
      name: levelData.name || "",
    });
  }

  async delete(id: number) {
    return await levelRepository.delete(id);
  }
}

export default new LevelService();
