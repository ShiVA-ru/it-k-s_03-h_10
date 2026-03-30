import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { userInputDtoValidation } from "../validation/users.input-dto.validation.middleware";
import { paginationSortingSearchValidation } from "../validation/users.query.validation.middleware";
import { usersControllerInstance } from "./users.controller";

export const usersRouter = Router();

usersRouter.use(superAdminGuardMiddleware);

usersRouter
  .post(
    "/",
    userInputDtoValidation,
    inputValidationResultMiddleware,
    usersControllerInstance.createUser,
  )
  .get(
    "/",
    paginationSortingSearchValidation,
    inputValidationResultMiddleware,
    usersControllerInstance.getUsers,
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    usersControllerInstance.getUser,
  )

  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    usersControllerInstance.deleteUser,
  );
