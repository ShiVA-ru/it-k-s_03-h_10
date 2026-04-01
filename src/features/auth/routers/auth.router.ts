import { Router } from "express";
import { deviceMetaMiddleware } from "../../../core/middlewares/device-meta.middleware";
import { rateLimitGuardMiddleware } from "../../../core/middlewares/guards/rate-limit.guard";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { userInputDtoValidation } from "../../users/validation/users.input-dto.validation.middleware";
import { accessTokenGuardMiddleware } from "../middlewares/access-token.guard";
import { refreshTokenGuardMiddleware } from "../middlewares/refresh-token.guard";
import { loginInputDtoValidation } from "../validation/auth.input-dto.validation.middleware";
import { confirmationCodeValidation } from "../validation/auth.registration-confirm.validation.middleware";
import { emailValidation } from "../validation/auth.registration-resending.validation.middleware";
import { authControllerInstance } from "./auth.controller";

export const authRouter = Router();

authRouter
  .post(
    "/login",
    rateLimitGuardMiddleware,
    loginInputDtoValidation,
    inputValidationResultMiddleware,
    deviceMetaMiddleware,
    authControllerInstance.login.bind(authControllerInstance),
  )
  .post(
    "/logout",
    refreshTokenGuardMiddleware,
    authControllerInstance.logout.bind(authControllerInstance),
  )

  .post(
    "/refresh-token",
    refreshTokenGuardMiddleware,
    authControllerInstance.refreshToken.bind(authControllerInstance),
  )

  .get(
    "/me",
    accessTokenGuardMiddleware,
    authControllerInstance.getMe.bind(authControllerInstance),
  )

  .post(
    "/registration",
    rateLimitGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    authControllerInstance.registration.bind(authControllerInstance),
  )

  .post(
    "/registration-confirmation",
    rateLimitGuardMiddleware,
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    authControllerInstance.registrationConfirmation.bind(
      authControllerInstance,
    ),
  )

  .post(
    "/registration-email-resending",
    rateLimitGuardMiddleware,
    emailValidation,
    inputValidationResultMiddleware,
    authControllerInstance.registrationEmailResending.bind(
      authControllerInstance,
    ),
  );
