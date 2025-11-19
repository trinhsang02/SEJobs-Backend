import { CreateEmploymentTypeDto } from "@/dtos/job/CreateEmploymentType.dto";
import { UpdateEmploymentTypeDto } from "@/dtos/job/UpdateEmploymentType.dto";
import employment_typesRepository from "@/repositories/employment_types.repository";
import { EmploymentTypeQueryParams } from "@/types/common";

export class EmploymentTypeService {
  async findAll(input: EmploymentTypeQueryParams) {
    return await employment_typesRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await employment_typesRepository.findOne(input.id);
  }

  async create(input: { employmentTypeData: CreateEmploymentTypeDto }) {
    const { employmentTypeData } = input;

    return await employment_typesRepository.create({
      employmentTypeData: employmentTypeData,
    });
  }

  async update(input: { employmentTypeData: UpdateEmploymentTypeDto }) {
    const { employmentTypeData } = input;

    return await employment_typesRepository.update(employmentTypeData.id, {
      name: employmentTypeData.name || "",
    });
  }

  async deleteEmploymentType(id: number) {
    return await employment_typesRepository.delete(id);
  }
}

export default new EmploymentTypeService();
