import type { Response } from "express";
import type { validationErrorType } from "../../../../core/types/errors.types";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithBody } from "../../../../core/types/request.types";
import { resultCodeToHttpException } from "../../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { usersService } from "../../application/users.service";
import { usersQueryRepository } from "../../repositories/users.query.repository";
import type { UserInput } from "../../types/users.input.type";
import type { UserView } from "../../types/users.view.type";

export async function createUserHandler(
  req: RequestWithBody<UserInput>,
  res: Response<UserView | validationErrorType[]>,
) {
  try {
    const result = await usersService.create(req.body, true);

    if (!isSuccessResult(result)) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(result.extensions);
    }

    const createdEntity = await usersQueryRepository.findOneById(
      result.data.insertedId,
    );

    if (!createdEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Created).json(createdEntity);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
