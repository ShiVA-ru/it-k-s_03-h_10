import type { Response } from "express";
import type { validationErrorsDto } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import type { BlogView } from "../../types/blogs.view.type";

export async function getBlogHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response<BlogView | validationErrorsDto>,
) {
  try {
    const findEntity = await blogsQueryRepository.findOneById(req.params.id);

    if (!findEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Ok).json(findEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
