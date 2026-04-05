import { inject, injectable } from "inversify";
import type { IdType } from "../../../core/types/id.types.js";
import { ResultStatus } from "../../../core/types/result.code.js";
import type { Result } from "../../../core/types/result.type.js";
import { PostsRepository } from "../../posts/repositories/posts.repository.js";
import { UsersRepository } from "../../users/repositories/users.repository.js";
import { CommentsRepository } from "../repositories/comments.repository.js";
import { CommentDb } from "../types/comments.db.type.js";
import type { CommentInput } from "../types/comments.input.type.js";

@injectable()
export class CommentsService {
	constructor(
		@inject(CommentsRepository)
		protected commentsRepository: CommentsRepository,
		@inject(PostsRepository)
		protected postsRepository: PostsRepository,
		@inject(UsersRepository)
		protected usersRepository: UsersRepository,
	) {}

	async create(
		userId: string,
		postId: string,
		dto: CommentInput,
	): Promise<Result<IdType | null>> {
		const postEntity = await this.postsRepository.findOneById(postId);

		if (!postEntity) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "Post not found",
				extensions: [],
				data: null,
			};
		}

		const userEntity = await this.usersRepository.findOneById(userId);

		if (!userEntity) {
			return {
				status: ResultStatus.NotFound,
				errorMessage: "User not found",
				extensions: [],
				data: null,
			};
		}

		const newEntity = new CommentDb(
			dto.content,
			{
				userId: userId,
				userLogin: userEntity.login,
			},
			postId,
		);

		const commentId = await this.commentsRepository.create(newEntity);

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
		const updatedEntity = await this.commentsRepository.findOneById(id);

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

		const isUpdated = await this.commentsRepository.updateById(id, dto);

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
		const deletedEntity = await this.commentsRepository.findOneById(id);

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

		const isDeleted = await this.commentsRepository.deleteOneById(id);

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
