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
import { authController } from "../../../composition-root";

export const authRouter = Router();

authRouter
  .post(
    "/login",
    rateLimitGuardMiddleware,
    loginInputDtoValidation,
    inputValidationResultMiddleware,
    deviceMetaMiddleware,
    authController.login.bind(authController),
  )
  .post(
    "/logout",
    refreshTokenGuardMiddleware,
    authController.logout.bind(authController),
  )

  .post(
    "/refresh-token",
    refreshTokenGuardMiddleware,
    authController.refreshToken.bind(authController),
  )

  .get(
    "/me",
    accessTokenGuardMiddleware,
    authController.getMe.bind(authController),
  )

  .post(
    "/registration",
    rateLimitGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    authController.registration.bind(authController),
  )

  .post(
    "/registration-confirmation",
    rateLimitGuardMiddleware,
    confirmationCodeValidation,
    inputValidationResultMiddleware,
    authController.registrationConfirmation.bind(authController),
  )

  .post(
    "/registration-email-resending",
    rateLimitGuardMiddleware,
    emailValidation,
    inputValidationResultMiddleware,
    authController.registrationEmailResending.bind(authController),
  );
