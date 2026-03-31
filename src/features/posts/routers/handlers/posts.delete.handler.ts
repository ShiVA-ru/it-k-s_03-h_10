import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { postsServiceInstance } from "../../application/posts.service";

export async function deletePostHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response,
) {
  try {
    const isDeleted = await postsServiceInstance.deleteOneById(req.params.id);

    if (!isDeleted) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
