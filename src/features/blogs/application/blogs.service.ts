import { blogsRepository } from "../repositories/blogs.repository";
import type { BlogDb } from "../types/blogs.db.type";
import type { BlogInput } from "../types/blogs.input.type";

export const blogsService = {
  async create(dto: BlogInput): Promise<string> {
    const newEntity: BlogDb = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    return blogsRepository.create(newEntity);
  },

  async updateById(id: string, dto: BlogInput): Promise<boolean> {
    return await blogsRepository.updateById(id, dto);
  },

  async deleteOneById(id: string): Promise<boolean> {
    return await blogsRepository.deleteOneById(id);
  },
};
