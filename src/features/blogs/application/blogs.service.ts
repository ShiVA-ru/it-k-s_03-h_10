import { blogsRepository } from "../repositories/blogs.repository";
import { BlogDb } from "../types/blogs.db.type";
import type { BlogInput } from "../types/blogs.input.type";

class BlogsService {
  async create(dto: BlogInput): Promise<string> {
    const newEntity = new BlogDb(dto.name, dto.description, dto.websiteUrl);

    return blogsRepository.create(newEntity);
  }

  async updateById(id: string, dto: BlogInput): Promise<boolean> {
    return await blogsRepository.updateById(id, dto);
  }

  async deleteOneById(id: string): Promise<boolean> {
    return await blogsRepository.deleteOneById(id);
  }
}

export const blogsServiceInstance = new BlogsService();
