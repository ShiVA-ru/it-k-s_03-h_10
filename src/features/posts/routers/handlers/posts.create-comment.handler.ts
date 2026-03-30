import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { IdType } from "../../../../core/types/id.types";
import type { RequestWithParamsBodyUserId } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { commentsService } from "../../../comments/application/comments.service";
import { commentsQueryRepository } from "../../../comments/repositories/comments.query.repository";
import type { CommentInput } from "../../../comments/types/comments.input.type";
import type { CommentView } from "../../../comments/types/comments.view.type";

export async function createPostCommentHandler(
  req: RequestWithParamsBodyUserId<URIParamsId, CommentInput, IdType>,
  res: Response<CommentView>,
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    const postId = req.params.id;

    if (!postId) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    const createResult = await commentsService.create(userId, postId, req.body);

    if (!isSuccessResult(createResult)) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    const createdEntity = await commentsQueryRepository.findOneById(
      createResult.data.id,
    );

    if (!createdEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Created).json(createdEntity);
  } catch (error) {
    console.error(error);
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}
