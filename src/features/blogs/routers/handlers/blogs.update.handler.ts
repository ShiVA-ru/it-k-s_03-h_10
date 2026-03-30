import type { Response } from "express";
import type { validationErrorsDto } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParamsAndBody } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { blogsService } from "../../application/blogs.service";
import type { BlogInput } from "../../types/blogs.input.type";
import type { BlogView } from "../../types/blogs.view.type";

export async function updateBlogHandler(
  req: RequestWithParamsAndBody<URIParamsId, BlogInput>,
  res: Response<BlogView | validationErrorsDto>,
) {
  try {
    const isUpdated = await blogsService.updateById(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
