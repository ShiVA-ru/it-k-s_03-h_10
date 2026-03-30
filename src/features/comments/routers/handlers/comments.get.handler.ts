import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { commentsQueryRepository } from "../../repositories/comments.query.repository";
import type { CommentView } from "../../types/comments.view.type";

export async function getCommentHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response<CommentView>,
) {
  try {
    const findEntity = await commentsQueryRepository.findOneById(req.params.id);

    if (!findEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Ok).json(findEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
