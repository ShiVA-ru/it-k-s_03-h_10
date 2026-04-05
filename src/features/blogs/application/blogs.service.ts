import { inject, injectable } from "inversify";
import { BlogsRepository } from "../repositories/blogs.repository.js";
import { BlogDb } from "../types/blogs.db.type.js";
import type { BlogInput } from "../types/blogs.input.type.js";

@injectable()
export class BlogsService {
	constructor(
		@inject(BlogsRepository)
		protected blogsRepository: BlogsRepository,
	) {}

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
