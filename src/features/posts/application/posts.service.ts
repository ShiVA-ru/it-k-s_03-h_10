import { blogsRepositoryInstance } from "../../blogs/repositories/blogs.repository";
import { postsRepository } from "../repositories/posts.repository";
import { PostDb } from "../types/posts.db.type";
import type { PostInput } from "../types/posts.input.type";

class PostsService {
  async create(dto: PostInput): Promise<string | null> {
    const blogEntity = await blogsRepositoryInstance.findOneById(dto.blogId);

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

    return postsRepository.create(newEntity);
  }

  async updateById(
    id: string,
    dto: PostInput,
  ): Promise<{ notFound: boolean; entity: "post" | "blog" | null }> {
    const blogEntity = await blogsRepositoryInstance.findOneById(dto.blogId);

    if (!blogEntity) {
      return { notFound: true, entity: "blog" };
    }

    const isUpdated = await postsRepository.updateById(id, {
      ...dto,
      blogName: blogEntity.name,
    });

    if (!isUpdated) {
      return { notFound: true, entity: "post" };
    }

    return { notFound: false, entity: null };
  }

  async deleteOneById(id: string): Promise<boolean> {
    return await postsRepository.deleteOneById(id);
  }
}

export const postsServiceInstance = new PostsService();
