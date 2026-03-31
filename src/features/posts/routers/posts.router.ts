import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { commentInputDtoValidation } from "../../comments/validation/comments.input-dto.validation.middleware";
import { postInputDtoValidation } from "../validation/posts.input-dto.validation.middleware";
import { paginationSortingValidation } from "../validation/posts.query.validation.middleware";
import { postsControllerInstance } from "./posts.controller";

export const postsRouter = Router();

//Заменить тип Response PostView на DTO

postsRouter
  //CREATE
  .post(
    "/",
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.createPost,
  )
  //READ
  .get(
    "/",
    paginationSortingValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.getPosts,
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.getPost,
  )
  //UPDATE
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.updatePost,
  )
  //DELETE
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.deletePost,
  )
  .get(
    "/:id/comments",
    idValidation,
    paginationSortingValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.getPostComments,
  )
  //TODO add validation for dto
  .post(
    "/:id/comments",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.createPostComment,
  );
