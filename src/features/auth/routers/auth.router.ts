import { Router } from "express";
import { rateLimitGuardMiddleware } from "../../../core/middlewares/guards/rate-limit.guard";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { userInputDtoValidation } from "../../users/validation/users.input-dto.validation.middleware";
import { accessTokenGuardMiddleware } from "../middlewares/access-token.guard";
import { deviceMetaMiddleware } from "../../../core/middlewares/device-meta.middleware";
import { refreshTokenGuardMiddleware } from "../middlewares/refresh-token.guard";
import { loginInputDtoValidation } from "../validation/auth.input-dto.validation.middleware";
import { confirmationCodeValidation } from "../validation/auth.registration-confirm.validation.middleware";
import { emailValidation } from "../validation/auth.registration-resending.validation.middleware";
import { loginHandler } from "./handlers/auth.login.handler";
import { logoutHandler } from "./handlers/auth.logout.handler";
import { getMeHandler } from "./handlers/auth.me.get-user.hanler";
import { refreshTokenHandler } from "./handlers/auth.refresh-token.handler";
import { registrationHandler } from "./handlers/auth.registration.handler";
import { registrationConfirmationHandler } from "./handlers/auth.registration-confirmation.handler";
import { registrationEmailResendingHandler } from "./handlers/auth.registration-email-resending.handler";

export const authRouter = Router();

authRouter
  .post(
    "/login",
    rateLimitGuardMiddleware,
    loginInputDtoValidation,
    inputValidationResultMiddleware,
    deviceMetaMiddleware,
    loginHandler,
  )
  .post("/logout", refreshTokenGuardMiddleware, logoutHandler)

  .post("/refresh-token", refreshTokenGuardMiddleware, refreshTokenHandler)

  .get("/me", accessTokenGuardMiddleware, getMeHandler)

  .post(
    "/registration",
    rateLimitGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    registrationHandler,
  )

  .post(
    "/registration-confirmation",
    rateLimitGuardMiddleware,
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    registrationConfirmationHandler,
  )

  .post(
    "/registration-email-resending",
    rateLimitGuardMiddleware,
    emailValidation,
    inputValidationResultMiddleware,
    registrationEmailResendingHandler,
  );
