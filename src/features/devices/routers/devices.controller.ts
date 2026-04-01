import type { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import type { IdType } from "../../../core/types/id.types";
import type {
  RequestWithParams,
  RequestWithUserId,
} from "../../../core/types/request.types";
import type { URIParamsId } from "../../../core/types/uri-params.type";
import { DeviceService } from "../application/devices.service";
import { DevicesQueryRepository } from "../repositories/devices.query.repository";
import type { DeviceView } from "../types/devices.view.type";

class DeviceController {
  private devicesQueryRepository: DevicesQueryRepository;
  private deviceService: DeviceService;

  constructor() {
    this.devicesQueryRepository = new DevicesQueryRepository();
    this.deviceService = new DeviceService();
  }

  async getUserActiveSessions(
    req: RequestWithUserId<IdType>,
    res: Response<DeviceView[]>,
  ) {
    try {
      const userId = req.refreshTokenPayload.userId;

      if (!userId) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const devicesListOutput =
        await this.devicesQueryRepository.findAll(userId);

      res.status(HttpStatus.Ok).json(devicesListOutput);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deleteDevices(req: Request, res: Response) {
    try {
      console.log("delete all devices by userId");
      const { userId, deviceId } = req.refreshTokenPayload;

      if (!userId || !deviceId) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const isDeleted = await this.deviceService.deleteOther(userId, deviceId);

      if (!isDeleted) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      return res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }

  async deleteDeviceByIdHandler(
    req: RequestWithParams<URIParamsId>,
    res: Response,
  ) {
    try {
      const deviceId = req.params.id;
      const userId = req.refreshTokenPayload.userId;

      const findEntity = await this.deviceService.findByDeviceId(deviceId);

      if (!userId || !findEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      if (findEntity.userId !== userId) {
        return res.sendStatus(HttpStatus.Forbidden);
      }

      const isDeleted = await this.deviceService.deleteOneById(
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
}

export const deviceControllerInstance = new DeviceController();
