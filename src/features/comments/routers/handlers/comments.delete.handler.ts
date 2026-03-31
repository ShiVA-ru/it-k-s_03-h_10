import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { IdType } from "../../../../core/types/id.types";
import type { RequestWithParamsUserId } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { resultCodeToHttpException } from "../../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { commentsServiceInstance } from "../../application/comments.service";

export async function deleteCommentHandler(
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

    const deletedResult = await commentsServiceInstance.deleteOneById(
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
