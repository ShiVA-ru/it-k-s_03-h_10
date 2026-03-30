import type { Response } from "express";
import type { validationErrorsDto } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { usersQueryRepository } from "../../repositories/users.query.repository";
import type { UserView } from "../../types/users.view.type";

export async function getUserHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response<UserView | validationErrorsDto>,
) {
  try {
    const findEntity = await usersQueryRepository.findOneById(req.params.id);

    if (!findEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Ok).json(findEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
