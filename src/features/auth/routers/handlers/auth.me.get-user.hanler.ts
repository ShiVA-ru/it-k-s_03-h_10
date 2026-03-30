import type { Response } from "express";
import type { validationErrorsDto } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { IdType } from "../../../../core/types/id.types";
import type { RequestWithUserId } from "../../../../core/types/request.types";
import { usersQueryRepository } from "../../../users/repositories/users.query.repository";
import type { MeView } from "../../types/me.view.type";

export async function getMeHandler(
  req: RequestWithUserId<IdType>,
  res: Response<MeView | validationErrorsDto>,
) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    const findEntity = await usersQueryRepository.findMeById(userId);

    if (!findEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Ok).json(findEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
