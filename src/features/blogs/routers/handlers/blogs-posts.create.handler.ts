import type { Response } from "express";
import type { validationErrorsDto } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParamsAndBody } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { postsService } from "../../../posts/application/posts.service";
import { postsQueryRepository } from "../../../posts/repositories/posts.query.repository";
import type { BlogPostInput } from "../../../posts/types/blogs-posts.input.type";
import type { PostView } from "../../../posts/types/posts.view.type";

export async function createBlogPostHandler(
  req: RequestWithParamsAndBody<URIParamsId, BlogPostInput>,
  res: Response<PostView | validationErrorsDto>,
) {
  try {
    const blogId = req.params.id;
    const insertedId = await postsService.create({
      blogId,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
    });

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
