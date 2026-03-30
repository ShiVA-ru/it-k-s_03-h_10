import { blogsRepository } from "../../blogs/repositories/blogs.repository";
import { postsRepository } from "../repositories/posts.repository";
import type { PostDb } from "../types/posts.db.type";
import type { PostInput } from "../types/posts.input.type";

export const postsService = {
  async create(dto: PostInput): Promise<string | null> {
    const blogEntity = await blogsRepository.findOneById(dto.blogId);

    if (!blogEntity) {
      return null;
    }

    const newEntity: PostDb = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blogEntity.name,
      createdAt: new Date().toISOString(),
    };

    return postsRepository.create(newEntity);
  },

  async updateById(
    id: string,
    dto: PostInput,
  ): Promise<{ notFound: boolean; entity: "post" | "blog" | null }> {
    const blogEntity = await blogsRepository.findOneById(dto.blogId);

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
  },

  async deleteOneById(id: string): Promise<boolean> {
    return await postsRepository.deleteOneById(id);
  },

  // async findPostByBlogId(
  //   blogId: string,
  //   queryDto: PostsQueryInput,
  // ): Promise<{ items: WithId<PostDb>[]; totalCount: number } | null> {
  //   const blogEntity = await blogsRepository.findOneById(blogId);

  //   if (!blogEntity) {
  //     return null;
  //   }

  //   return postsRepository.findByBlogId(blogId, queryDto);
  // },
};
