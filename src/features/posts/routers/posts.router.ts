import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { commentInputDtoValidation } from "../../comments/validation/comments.input-dto.validation.middleware";
import { postInputDtoValidation } from "../validation/posts.input-dto.validation.middleware";
import { paginationSortingValidation } from "../validation/posts.query.validation.middleware";
import { createPostHandler } from "./handlers/posts.create.handler";
import { createPostCommentHandler } from "./handlers/posts.create-comment.handler";
import { deletePostHandler } from "./handlers/posts.delete.handler";
import { getPostHandler } from "./handlers/posts.get.handler";
import { getPostCommentsListHandler } from "./handlers/posts.get-comments-list.handler";
import { getPostListHandler } from "./handlers/posts.get-list.handler";
import { updatePostHandler } from "./handlers/posts.update.handler";

export const postsRouter = Router();

//Заменить тип Response PostView на DTO

postsRouter
  //CREATE
  .post(
    "/",
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  //READ
  .get(
    "/",
    paginationSortingValidation,
    inputValidationResultMiddleware,
    getPostListHandler,
  )

  .get("/:id", idValidation, inputValidationResultMiddleware, getPostHandler)
  //UPDATE
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  //DELETE
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  )
  .get(
    "/:id/comments",
    idValidation,
    paginationSortingValidation,
    inputValidationResultMiddleware,
    getPostCommentsListHandler,
  )
  //TODO add validation for dto
  .post(
    "/:id/comments",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    createPostCommentHandler,
  );
