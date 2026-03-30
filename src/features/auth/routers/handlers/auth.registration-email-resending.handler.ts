import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithBody } from "../../../../core/types/request.types";
import { resultCodeToHttpException } from "../../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { registrationService } from "../../application/auth.registration.service";
import type { RegistrationEmailResending } from "../../types/registration-resending.input.type";
import { createErrorMessages } from "../../../../core/middlewares/validation/input-validation-result.middleware";

export async function registrationEmailResendingHandler(
  req: RequestWithBody<RegistrationEmailResending>,
  res: Response,
) {
  try {
    console.log('POST -> "auth/registration-email-resending', req.body);
    const result = await registrationService.emailResending(req.body);

    if (!isSuccessResult(result)) {
      console.log('POST -> "auth/registration-email-resending error', result);
      return res
        .status(resultCodeToHttpException(result.status))
        .send(createErrorMessages(result.extensions));
    }
    console.log('POST -> "auth/registration-email-resending succefull', result);

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    return res.sendStatus(HttpStatus.InternalServerError);
  }
}
