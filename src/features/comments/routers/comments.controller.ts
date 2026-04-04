import type { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import type { IdType } from "../../../core/types/id.types.js";
import type {
	RequestWithParams,
	RequestWithParamsBodyUserId,
	RequestWithParamsUserId,
} from "../../../core/types/request.types.js";
import type { URIParamsId } from "../../../core/types/uri-params.type.js";
import { resultCodeToHttpException } from "../../../core/utils/result-code-to-http-exception.js";
import { isSuccessResult } from "../../../core/utils/type-guards.js";
import type { CommentsService } from "../application/comments.service.js";
import type { CommentsQueryRepository } from "../repositories/comments.query.repository.js";
import type { CommentInput } from "../types/comments.input.type.js";
import type { CommentView } from "../types/comments.view.type.js";

export class CommentsController {
	constructor(
		protected commentsService: CommentsService,
		protected commentsQueryRepository: CommentsQueryRepository,
	) {}
	async getComment(
		req: RequestWithParams<URIParamsId>,
		res: Response<CommentView>,
	) {
		try {
			const findEntity = await this.commentsQueryRepository.findOneById(
				req.params.id,
			);

			if (!findEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			return res.status(HttpStatus.Ok).json(findEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.NotFound);
		}
	}

	async updateComment(
		req: RequestWithParamsBodyUserId<URIParamsId, CommentInput, IdType>,
		res: Response<CommentView | { message: string }>,
	) {
		try {
			const userId = req.userId;

			if (!userId) {
				res.status(HttpStatus.NotFound).send({
					message: `user not found`,
				});
				return;
			}

			const updatedResult = await this.commentsService.updateById(
				userId,
				req.params.id,
				req.body,
			);

			if (!isSuccessResult(updatedResult)) {
				res.status(resultCodeToHttpException(updatedResult.status)).send({
					message: updatedResult.errorMessage ? updatedResult.errorMessage : "",
				});
				return;
			}

			res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async deleteComment(
		req: RequestWithParamsUserId<URIParamsId, IdType>,
		res: Response,
	) {
		try {
			const userId = req.userId;

			if (!userId) {
				res.status(HttpStatus.NotFound).send({
					message: `user not found`,
				});
				return;
			}

			const deletedResult = await this.commentsService.deleteOneById(
				userId,
				req.params.id,
			);

			if (!isSuccessResult(deletedResult)) {
				res.status(resultCodeToHttpException(deletedResult.status)).send({
					message: deletedResult.errorMessage ? deletedResult.errorMessage : "",
				});
				return;
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.NotFound);
		}
	}
}
