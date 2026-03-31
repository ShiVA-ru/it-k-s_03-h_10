import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithParams } from "../../../../core/types/request.types";
import type { URIParamsId } from "../../../../core/types/uri-params.type";
import { deviceServiceInstance } from "../../application/devices.service";

export async function deleteDeviceByIdHandler(
  req: RequestWithParams<URIParamsId>,
  res: Response,
) {
  try {
    const deviceId = req.params.id;
    const userId = req.refreshTokenPayload.userId;

    const findEntity = await deviceServiceInstance.findByDeviceId(deviceId);

    if (!userId || !findEntity) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    if (findEntity.userId !== userId) {
      return res.sendStatus(HttpStatus.Forbidden);
    }

    const isDeleted = await deviceServiceInstance.deleteOneById(
      req.params.id,
      userId,
    );

    if (!isDeleted) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
