import { Router } from "express";
import { deviceMetaMiddleware } from "../../../core/middlewares/device-meta.middleware";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { refreshTokenGuardMiddleware } from "../../auth/middlewares/refresh-token.guard";
import { deviceControllerInstance } from "./devices.controller";

export const devicesRouter = Router();

devicesRouter
  .get(
    "/",
    deviceMetaMiddleware,
    refreshTokenGuardMiddleware,
    deviceControllerInstance.getUserActiveSessions.bind(
      deviceControllerInstance,
    ),
  )

  .delete(
    "/",
    refreshTokenGuardMiddleware,
    deviceControllerInstance.deleteDevices.bind(deviceControllerInstance),
  )

  .delete(
    "/:id",
    refreshTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deviceControllerInstance.deleteDeviceByIdHandler.bind(
      deviceControllerInstance,
    ),
  );
