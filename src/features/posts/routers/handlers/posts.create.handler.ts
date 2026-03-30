import type { Response } from "express";
import type { validationErrorsDto } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithBody } from "../../../../core/types/request.types";
import { postsService } from "../../application/posts.service";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import type { PostInput } from "../../types/posts.input.type";
import type { PostView } from "../../types/posts.view.type";

export async function createPostHandler(
  req: RequestWithBody<PostInput>,
  res: Response<PostView | validationErrorsDto>,
) {
  try {
    const insertedId = await postsService.create(req.body);

    if (!insertedId) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    const createdEntity = await postsQueryRepository.findOneById(insertedId);

    if (!createdEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Created).json(createdEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
