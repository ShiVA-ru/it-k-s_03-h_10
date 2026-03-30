import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { IdType } from "../../../../core/types/id.types";
import type { RequestWithParamsBodyUserId } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { resultCodeToHttpException } from "../../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { commentsService } from "../../application/comments.service";
import type { CommentInput } from "../../types/comments.input.type";
import type { CommentView } from "../../types/comments.view.type";

export async function updateCommentHandler(
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

    const updatedResult = await commentsService.updateById(
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
