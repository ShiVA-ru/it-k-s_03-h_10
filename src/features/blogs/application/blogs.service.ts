import { BlogsRepository } from "../repositories/blogs.repository";
import { BlogDb } from "../types/blogs.db.type";
import type { BlogInput } from "../types/blogs.input.type";

export class BlogsService {
  private blogsRepository: BlogsRepository;

  constructor() {
    this.blogsRepository = new BlogsRepository();
  }

  async create(dto: BlogInput): Promise<string> {
    const newEntity = new BlogDb(dto.name, dto.description, dto.websiteUrl);

    return this.blogsRepository.create(newEntity);
  }

  async updateById(id: string, dto: BlogInput): Promise<boolean> {
    return await this.blogsRepository.updateById(id, dto);
  }

  async deleteOneById(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteOneById(id);
  }
}
