import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard";
import { commentInputDtoValidation } from "../validation/comments.input-dto.validation.middleware";
import { deleteCommentHandler } from "./handlers/comments.delete.handler";
import { getCommentHandler } from "./handlers/comments.get.handler";
import { updateCommentHandler } from "./handlers/comments.update.handler";

export const commentsRouter = Router();

//Заменить тип Response PostView на DTO

commentsRouter
  .get("/:id", idValidation, inputValidationResultMiddleware, getCommentHandler)
  //UPDATE
  .put(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )
  // DELETE
  .delete(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  );
