import type { Response } from "express";
import type { validationErrorType } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithBody } from "../../../../core/types/request.types";
import { blogsService } from "../../application/blogs.service";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import type { BlogInput } from "../../types/blogs.input.type";
import type { BlogView } from "../../types/blogs.view.type";

export async function createBlogHandler(
  req: RequestWithBody<BlogInput>,
  res: Response<BlogView | validationErrorType>,
) {
  try {
    const insertedId = await blogsService.create(req.body);

    const createdEntity = await blogsQueryRepository.findOneById(insertedId);

    if (!createdEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Created).json(createdEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
