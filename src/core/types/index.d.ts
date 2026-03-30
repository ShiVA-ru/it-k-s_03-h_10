// import type { IdType } from "./id.types";
import type { RefreshTokenPayload } from "../../features/auth/types/token-payload.type";
import type { DeviceMeta } from "./device-meta.types";

declare global {
  declare namespace Express {
    export interface Request {
      userId: string | undefined;
      // deviceId: string | undefined; //TODO Delete from Req type
      deviceMeta: DeviceMeta;
      refreshTokenPayload: RefreshTokenPayload;
    }
  }
}
