import { Router } from "express";
import { commentsController } from "../../../composition-root";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard";
import { commentInputDtoValidation } from "../validation/comments.input-dto.validation.middleware";

export const commentsRouter = Router();

commentsRouter
  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    commentsController.getComment.bind(commentsController),
  )
  //UPDATE
  .put(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    commentsController.updateComment.bind(commentsController),
  )
  // DELETE
  .delete(
    "/:id",
    accessTokenGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    commentsController.deleteComment.bind(commentsController),
  );
