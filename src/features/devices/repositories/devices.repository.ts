import type { WithId } from "mongodb";
import { devicesCollection } from "../../../db/mongo";
import type { DeviceDb } from "../types/devices.db.type";

export class DevicesRepository {
  async create(dto: DeviceDb): Promise<string> {
    const result = await devicesCollection.insertOne(dto);

    return result.insertedId.toString();
  }

  async update(deviceId: string, iat: number): Promise<boolean> {
    const updateResult = await devicesCollection.updateOne(
      { deviceId },
      {
        $set: {
          iat,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      return false;
    }

    return true;
  }

  async deleteOther(userId: string, currentdeviceId: string): Promise<boolean> {
    const deleteResult = await devicesCollection.deleteMany({
      userId,
      deviceId: { $ne: currentdeviceId },
    });

    if (deleteResult.deletedCount < 1) {
      return false;
    }

    return true;
  }

  async deleteOneById(deviceId: string, userId: string): Promise<boolean> {
    const deleteResult = await devicesCollection.deleteOne({
      deviceId,
      userId,
    });

    if (deleteResult.deletedCount < 1) {
      return false;
    }

    return true;
  }

  async findOneById(
    deviceId: string,
    iat: number,
  ): Promise<WithId<DeviceDb> | null> {
    const item = await devicesCollection.findOne({ deviceId, iat });

    if (!item) {
      return null;
    }

    return item;
  }

  async findByDeviceId(deviceId: string): Promise<WithId<DeviceDb> | null> {
    const item = await devicesCollection.findOne({ deviceId });

    if (!item) {
      return null;
    }

    return item;
  }
}
