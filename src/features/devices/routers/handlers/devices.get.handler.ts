import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { IdType } from "../../../../core/types/id.types";
import type { RequestWithUserId } from "../../../../core/types/request.types";
import { devicesQueryRepository } from "../../repositories/devices.query.repository";
import type { DeviceView } from "../../types/devices.view.type";

export async function getUserActiveSessions(
  req: RequestWithUserId<IdType>,
  res: Response<DeviceView[]>,
) {
  try {
    const userId = req.refreshTokenPayload.userId;

    if (!userId) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    const devicesListOutput = await devicesQueryRepository.findAll(userId);

    res.status(HttpStatus.Ok).json(devicesListOutput);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
