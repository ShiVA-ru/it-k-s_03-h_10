import type { IdType } from "../../../core/types/id.types";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { postsRepositoryInstance } from "../../posts/repositories/posts.repository";
import { usersRepositoryInstance } from "../../users/repositories/users.repository";
import { commentsRepository } from "../repositories/comments.repository";
import type { CommentDb } from "../types/comments.db.type";
import type { CommentInput } from "../types/comments.input.type";

class CommentsService {
  async create(
    userId: string,
    postId: string,
    dto: CommentInput,
  ): Promise<Result<IdType | null>> {
    const postEntity = await postsRepositoryInstance.findOneById(postId);

    if (!postEntity) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Post not found",
        extensions: [],
        data: null,
      };
    }

    const userEntity = await usersRepositoryInstance.findOneById(userId);

    if (!userEntity) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "User not found",
        extensions: [],
        data: null,
      };
    }

    const newEntity: CommentDb = {
      content: dto.content,
      postId: postId,
      commentatorInfo: {
        userId: userId,
        userLogin: userEntity.login,
      },
      createdAt: new Date().toISOString(),
    };

    const commentId = await commentsRepository.create(newEntity);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { id: commentId },
    };
  }

  async updateById(
    userId: string,
    id: string,
    dto: CommentInput,
  ): Promise<Result<true>> {
    const updatedEntity = await commentsRepository.findOneById(id);

    if (!updatedEntity) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "comment not found",
        extensions: [],
        data: null,
      };
    }

    if (updatedEntity?.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "user is incorrect",
        extensions: [],
        data: null,
      };
    }

    const isUpdated = await commentsRepository.updateById(id, dto);

    if (!isUpdated) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "comment is not updated",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  }

  async deleteOneById(userId: string, id: string): Promise<Result<true>> {
    const deletedEntity = await commentsRepository.findOneById(id);

    if (!deletedEntity) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "comment not found",
        extensions: [],
        data: null,
      };
    }

    if (deletedEntity?.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "user is incorrect",
        extensions: [],
        data: null,
      };
    }

    const isDeleted = await commentsRepository.deleteOneById(id);

    if (!isDeleted) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "comment is not updated",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  }
}

export const commentsServiceInstance = new CommentsService();
