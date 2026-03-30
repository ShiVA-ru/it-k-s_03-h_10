import type { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import { isSuccessResult } from "../../../core/utils/type-guards";
import { usersServiceInstance } from "../../users/application/users.service";
import { jwtService } from "../application/jwt.service";

export const refreshTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const verifyResult = await jwtService.verifyRefreshToken(token);

  if (!isSuccessResult(verifyResult)) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const userId = verifyResult.data.userId;
  const deviceId = verifyResult.data.deviceId;
  const iat = verifyResult.data.iat;

  const userEntity = await usersServiceInstance.findById(userId);

  if (!userEntity) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.refreshTokenPayload = {
    userId,
    deviceId,
    iat,
  };
  next();
};
