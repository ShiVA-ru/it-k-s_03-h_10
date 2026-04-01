import dayjs from "dayjs";
import type { DeviceMeta } from "../../../core/types/device-meta.types";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import type { DevicesRepository } from "../repositories/devices.repository";
import { DeviceDb } from "../types/devices.db.type";

export class DevicesService {
  constructor(protected devicesRepository: DevicesRepository) {}

  async create(
    dto: DeviceMeta & { userId: string },
    iat: number,
  ): Promise<Result<{ insertedId: string } | null>> {
    const { ip, userAgent, userId } = dto;

    const newEntity = new DeviceDb(
      ip,
      userAgent,
      iat,
      dayjs().add(1, "hour").toISOString(),
      userId,
    );

    const insertedId = await this.devicesRepository.create(newEntity);

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
  }

  async findById(deviceId: string, iat: number): Promise<DeviceDb | null> {
    return await this.devicesRepository.findOneById(deviceId, iat);
  }

  async findByDeviceId(deviceId: string): Promise<DeviceDb | null> {
    return await this.devicesRepository.findByDeviceId(deviceId);
  }

  async deleteOneById(deviceId: string, userId: string): Promise<boolean> {
    return await this.devicesRepository.deleteOneById(deviceId, userId);
  }

  async deleteOther(userId: string, deviceId: string): Promise<boolean> {
    return await this.devicesRepository.deleteOther(userId, deviceId);
  }
}
