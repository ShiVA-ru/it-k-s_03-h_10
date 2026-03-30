import type { Request, Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import { deviceService } from "../../application/devices.service";

export async function deleteDevicesHandler(req: Request, res: Response) {
  try {
    console.log("delete all devices by userId");
    const { userId, deviceId } = req.refreshTokenPayload;

    if (!userId || !deviceId) {
      return res.sendStatus(HttpStatus.NotFound);
    }
    console.log("===delete other sessions===");
    console.log("userId", userId);
    console.log("deviceId", deviceId);
    console.log("===end of deleting other sessions===");

    const isDeleted = await deviceService.deleteOther(userId, deviceId);

    if (!isDeleted) {
      return res.sendStatus(HttpStatus.NotFound);
    }

    return res.sendStatus(HttpStatus.NoContent);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.NotFound);
  }
}
