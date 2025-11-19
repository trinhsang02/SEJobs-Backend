import { CreateCategoryDto } from "@/dtos/job/CreateCategory.dto";
import { UpdateCategoryDto } from "@/dtos/job/UpdateCategory.dto";
import categoryRepository from "@/repositories/categories.repository";
import { CategoryQueryParams } from "@/types/common";

export class CategoryService {
  async findAll(input: CategoryQueryParams) {
    return await categoryRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await categoryRepository.findOne(input.id);
  }

  async create(input: { categoryData: CreateCategoryDto }) {
    const { categoryData } = input;

    return await categoryRepository.create({
      categoryData: categoryData
    });
  }

  async update(input: { categoryData: UpdateCategoryDto }) {
    const { categoryData } = input;

    return await categoryRepository.update(categoryData.id, {
      name: categoryData.name || ""
    });
  }

  async deleteCategory(id: number) {
    return await categoryRepository.delete(id);
  }
}

export default new CategoryService();
