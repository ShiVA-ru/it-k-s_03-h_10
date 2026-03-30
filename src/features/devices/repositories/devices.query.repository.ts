import { devicesCollection } from "../../../db/mongo";
import type { DeviceView } from "../types/devices.view.type";
import { mapEntityToViewModel } from "./mappers/users.entity-map";

export const devicesQueryRepository = {
  async findAll(userId: string): Promise<DeviceView[]> {
    const items = await devicesCollection.find({ userId }).toArray();

    return items.map(mapEntityToViewModel);
  },
};
