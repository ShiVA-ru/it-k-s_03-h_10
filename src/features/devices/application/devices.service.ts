import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import type { DeviceMeta } from "../../../core/types/device-meta.types";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { devicesRepository } from "../repositories/devices.repository";
import type { DeviceDb } from "../types/devices.db.type";

export const deviceService = {
  async create(
    dto: DeviceMeta & { userId: string },
    now: number,
  ): Promise<Result<{ insertedId: string } | null>> {
    const { ip, userAgent, userId } = dto;

    const newEntity: DeviceDb = {
      ip,
      title: userAgent,
      userId,
      deviceId: randomUUID(),
      iat: now,
      expiresDate: dayjs().add(1, "hour").toISOString(),
    };

    const insertedId = await devicesRepository.create(newEntity);

    if (!insertedId) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Credentials is not correct",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { insertedId: newEntity.deviceId },
    };
  },

  async findById(deviceId: string, iat: number): Promise<DeviceDb | null> {
    return await devicesRepository.findOneById(deviceId, iat);
  },

  async findByDeviceId(deviceId: string): Promise<DeviceDb | null> {
    return await devicesRepository.findByDeviceId(deviceId);
  },

  async deleteOneById(deviceId: string, userId: string): Promise<boolean> {
    return await devicesRepository.deleteOneById(deviceId, userId);
  },

  async deleteOther(userId: string, deviceId: string): Promise<boolean> {
    return await devicesRepository.deleteOther(userId, deviceId);
  },
};
