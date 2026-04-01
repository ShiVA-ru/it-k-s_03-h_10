import type { BlogsRepository } from "../../blogs/repositories/blogs.repository";
import type { PostsRepository } from "../repositories/posts.repository";
import { PostDb } from "../types/posts.db.type";
import type { PostInput } from "../types/posts.input.type";

export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected blogsRepository: BlogsRepository,
  ) {}

  async create(dto: PostInput): Promise<string | null> {
    const blogEntity = await this.blogsRepository.findOneById(dto.blogId);

    if (!blogEntity) {
      return null;
    }

    const newEntity = new PostDb(
      dto.title,
      dto.shortDescription,
      dto.content,
      dto.blogId,
      blogEntity.name,
    );

    return this.postsRepository.create(newEntity);
  }

  async updateById(
    id: string,
    dto: PostInput,
  ): Promise<{ notFound: boolean; entity: "post" | "blog" | null }> {
    const blogEntity = await this.blogsRepository.findOneById(dto.blogId);

    if (!blogEntity) {
      return { notFound: true, entity: "blog" };
    }

    const isUpdated = await this.postsRepository.updateById(id, {
      ...dto,
      blogName: blogEntity.name,
    });

    if (!isUpdated) {
      return { notFound: true, entity: "post" };
    }

    return { notFound: false, entity: null };
  }

  async deleteOneById(id: string): Promise<boolean> {
    return await this.postsRepository.deleteOneById(id);
  }
}
