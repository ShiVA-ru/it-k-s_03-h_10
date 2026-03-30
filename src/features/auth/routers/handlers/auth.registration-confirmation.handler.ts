import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithBody } from "../../../../core/types/request.types";
import { resultCodeToHttpException } from "../../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { registrationService } from "../../application/auth.registration.service";
import type { RegistrationConfirmationCode } from "../../types/confirmation.input.type";
import { createErrorMessages } from "../../../../core/middlewares/validation/input-validation-result.middleware";

export async function registrationConfirmationHandler(
  req: RequestWithBody<RegistrationConfirmationCode>,
  res: Response,
) {
  try {
    const result = await registrationService.confirmEmail(req.body);

    if (!isSuccessResult(result)) {
      return res
        .status(resultCodeToHttpException(result.status))
        .send(createErrorMessages(result.extensions));
    }

    res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
