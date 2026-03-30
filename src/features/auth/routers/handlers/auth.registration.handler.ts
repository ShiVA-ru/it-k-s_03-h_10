import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithBody } from "../../../../core/types/request.types";
import { resultCodeToHttpException } from "../../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import type { UserInput } from "../../../users/types/users.input.type";
import { registrationService } from "../../application/auth.registration.service";
import { createErrorMessages } from "../../../../core/middlewares/validation/input-validation-result.middleware";

export async function registrationHandler(
  req: RequestWithBody<UserInput>,
  res: Response,
) {
  try {
    const result = await registrationService.registration(req.body);
    console.log("result", result);

    if (!isSuccessResult(result)) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(createErrorMessages(result.extensions));
    }

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}
