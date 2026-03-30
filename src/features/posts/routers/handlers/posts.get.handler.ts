import type { Response } from "express";
import type { validationErrorsDto } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import type { PostView } from "../../types/posts.view.type";

export async function getPostHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response<PostView | validationErrorsDto>,
) {
  try {
    const findEntity = await postsQueryRepository.findOneById(req.params.id);

    if (!findEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.status(HttpStatus.Ok).json(findEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
