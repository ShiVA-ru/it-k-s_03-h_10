import { Router } from "express";
import { deviceMetaMiddleware } from "../../../core/middlewares/device-meta.middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { refreshTokenGuardMiddleware } from "../../auth/middlewares/refresh-token.guard";
import { devicesController } from "../../../composition-root";

export const devicesRouter = Router();

devicesRouter
  .get(
    "/",
    deviceMetaMiddleware,
    refreshTokenGuardMiddleware,
    devicesController.getUserActiveSessions.bind(devicesController),
  )

  .delete(
    "/",
    refreshTokenGuardMiddleware,
    devicesController.deleteDevices.bind(devicesController),
  )

  .delete(
    "/:id",
    refreshTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    devicesController.deleteDeviceByIdHandler.bind(devicesController),
  );
