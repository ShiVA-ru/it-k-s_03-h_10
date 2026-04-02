import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { userInputDtoValidation } from "../validation/users.input-dto.validation.middleware";
import { paginationSortingSearchValidation } from "../validation/users.query.validation.middleware";
import { usersController } from "../../../composition-root";

export const usersRouter = Router();

usersRouter.use(superAdminGuardMiddleware);

usersRouter
  .post(
    "/",
    userInputDtoValidation,
    inputValidationResultMiddleware,
    usersController.createUser.bind(usersController),
  )
  .get(
    "/",
    paginationSortingSearchValidation,
    inputValidationResultMiddleware,
    usersController.getUsers.bind(usersController),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    usersController.getUser.bind(usersController),
  )

  .delete(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    usersController.deleteUser.bind(usersController),
  );
