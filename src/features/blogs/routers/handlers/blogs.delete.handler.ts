import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { blogsServiceInstance } from "../../application/blogs.service";

export async function deleteBlogHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response,
) {
  try {
    const isDeleted = await blogsServiceInstance.deleteOneById(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
