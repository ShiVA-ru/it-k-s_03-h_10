import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard";
import { commentInputDtoValidation } from "../validation/comments.input-dto.validation.middleware";
import { commentsControllerInstance } from "./comments.controller";

export const commentsRouter = Router();

//Заменить тип Response PostView на DTO

commentsRouter
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    commentsControllerInstance.getComment,
  )
  //UPDATE
  .put(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    commentsControllerInstance.updateComment,
  )
  // DELETE
  .delete(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    commentsControllerInstance.deleteComment,
  );
