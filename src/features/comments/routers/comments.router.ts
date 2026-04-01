import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard";
import { commentInputDtoValidation } from "../validation/comments.input-dto.validation.middleware";
import { commentsControllerInstance } from "./comments.controller";

export const commentsRouter = Router();

commentsRouter
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    commentsControllerInstance.getComment.bind(commentsControllerInstance),
  )
  //UPDATE
  .put(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    commentsControllerInstance.updateComment.bind(commentsControllerInstance),
  )
  // DELETE
  .delete(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    commentsControllerInstance.deleteComment.bind(commentsControllerInstance),
  );
