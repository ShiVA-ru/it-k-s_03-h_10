import type { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { deviceService } from "../../../devices/application/devices.service";
import { authService } from "../../application/auth.service";

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    const { userId, deviceId, iat } = req.refreshTokenPayload;

    if (!userId || !deviceId) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const isSessionExist = await deviceService.findById(deviceId, iat);

    if (!isSessionExist) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    const result = await authService.logoutByDevice(userId, deviceId);

    if (!isSuccessResult(result)) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }

    res.clearCookie("refreshToken");

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
