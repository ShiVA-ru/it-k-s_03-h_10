import { Router } from "express";
import { deviceMetaMiddleware } from "../../../core/middlewares/device-meta.middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { refreshTokenGuardMiddleware } from "../../auth/middlewares/refresh-token.guard";
import { deleteDevicesHandler } from "./handlers/devices.delete.handler";
import { deleteDeviceByIdHandler } from "./handlers/devices.delete-by-id.handler";
import { getUserActiveSessions } from "./handlers/devices.get.handler";

export const devicesRouter = Router();

devicesRouter
  .get(
    "/",
    deviceMetaMiddleware,
    refreshTokenGuardMiddleware,
    getUserActiveSessions,
  )

  .delete("/", refreshTokenGuardMiddleware, deleteDevicesHandler)

  .delete(
    "/:id",
    refreshTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteDeviceByIdHandler,
  );
