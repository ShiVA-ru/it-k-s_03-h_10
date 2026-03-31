import type { Request, Response } from "express";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import type { validationErrorsDto } from "../../../core/types/errors.types";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import type { IdType } from "../../../core/types/id.types";
import type {
  RequestWithBody,
  RequestWithUserId,
} from "../../../core/types/request.types";
import { resultCodeToHttpException } from "../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../core/utils/type-guards";
import { deviceServiceInstance } from "../../devices/application/devices.service";
import { usersQueryRepositoryInstance } from "../../users/repositories/users.query.repository";
import type { UserInput } from "../../users/types/users.input.type";
import { registrationServiceInstance } from "../application/auth.registration.service";
import { authServiceInstance } from "../application/auth.service";
import type { RegistrationConfirmationCode } from "../types/confirmation.input.type";
import type { LoginInput } from "../types/login.input.type";
import type { MeView } from "../types/me.view.type";
import type { RegistrationEmailResending } from "../types/registration-resending.input.type";

class AuthController {
  async login(req: RequestWithBody<LoginInput>, res: Response) {
    try {
      const { loginOrEmail, password } = req.body;
      console.log("req.deviceMeta", req.deviceMeta);

      const result = await authServiceInstance.loginUser(
        loginOrEmail,
        password,
        req.deviceMeta,
      );

      if (!isSuccessResult(result)) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }
      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      return res
        .status(HttpStatus.Ok)
        .json({ accessToken: result.data.accessToken });
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { userId, deviceId, iat } = req.refreshTokenPayload;

      if (!userId || !deviceId) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }

      const isSessionExist = await deviceServiceInstance.findById(
        deviceId,
        iat,
      );

      if (!isSessionExist) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }

      const result = await authServiceInstance.logoutByDevice(userId, deviceId);

      if (!isSuccessResult(result)) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }

      res.clearCookie("refreshToken");

      return res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async refreshToken(req: RequestWithUserId<IdType>, res: Response) {
    try {
      const { userId, deviceId, iat } = req.refreshTokenPayload;

      if (!userId || !deviceId) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }

      const isSessionExist = await deviceServiceInstance.findById(
        deviceId,
        iat,
      );

      if (!isSessionExist) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }

      const result = await authServiceInstance.updateTokens(userId, deviceId);

      if (!isSuccessResult(result)) {
        return res.sendStatus(HttpStatus.Unauthorized);
      }

      res.cookie("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res
        .status(HttpStatus.Ok)
        .json({ accessToken: result.data.accessToken });
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async getMe(
    req: RequestWithUserId<IdType>,
    res: Response<MeView | validationErrorsDto>,
  ) {
    try {
      const userId = req.userId;

      if (!userId) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }

      const findEntity = await usersQueryRepositoryInstance.findMeById(userId);

      if (!findEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      res.status(HttpStatus.Ok).json(findEntity);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }

  async registration(req: RequestWithBody<UserInput>, res: Response) {
    try {
      const result = await registrationServiceInstance.registration(req.body);
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

  async registrationConfirmation(
    req: RequestWithBody<RegistrationConfirmationCode>,
    res: Response,
  ) {
    try {
      const result = await registrationServiceInstance.confirmEmail(req.body);

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

  async registrationEmailResending(
    req: RequestWithBody<RegistrationEmailResending>,
    res: Response,
  ) {
    try {
      console.log('POST -> "auth/registration-email-resending', req.body);
      const result = await registrationServiceInstance.emailResending(req.body);

      if (!isSuccessResult(result)) {
        console.log('POST -> "auth/registration-email-resending error', result);
        return res
          .status(resultCodeToHttpException(result.status))
          .send(createErrorMessages(result.extensions));
      }
      console.log(
        'POST -> "auth/registration-email-resending succefull',
        result,
      );

      return res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      return res.sendStatus(HttpStatus.InternalServerError);
    }
  }
}

export const authControllerInstance = new AuthController();
