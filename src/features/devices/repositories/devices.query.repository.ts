import { injectable } from "inversify";
import { devicesCollection } from "../../../db/mongo.js";
import type { DeviceView } from "../types/devices.view.type.js";
import { mapEntityToViewModel } from "./mappers/users.entity-map.js";

@injectable()
export class DevicesQueryRepository {
	async findAll(userId: string): Promise<DeviceView[]> {
		const items = await devicesCollection.find({ userId }).toArray();

		return items.map(mapEntityToViewModel);
	}
}
