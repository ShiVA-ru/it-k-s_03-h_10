import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { usersService } from "../../application/users.service";

export async function deleteUserHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response,
) {
  try {
    const isDeleted = await usersService.deleteOneById(req.params.id);

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
