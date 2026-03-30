import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { userInputDtoValidation } from "../validation/users.input-dto.validation.middleware";
import { paginationSortingSearchValidation } from "../validation/users.query.validation.middleware";
import { createUserHandler } from "./handlers/users.create.handler";
import { deleteUserHandler } from "./handlers/users.delete.handler";
import { getUserHandler } from "./handlers/users.get.handler";
import { getUserListHandler } from "./handlers/users.get-list.handler";

export const usersRouter = Router();

usersRouter.use(superAdminGuardMiddleware);

usersRouter
  .post(
    "/",
    userInputDtoValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .get(
    "/",
    paginationSortingSearchValidation,
    inputValidationResultMiddleware,
    getUserListHandler,
  )

  .get("/:id", idValidation, inputValidationResultMiddleware, getUserHandler)

  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );
