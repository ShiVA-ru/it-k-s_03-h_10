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
    postsControllerInstance.createPost.bind(postsControllerInstance),
  )
  //READ
  .get(
    "/",
    paginationSortingValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.getPosts.bind(postsControllerInstance),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.getPost.bind(postsControllerInstance),
  )
  //UPDATE
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.updatePost.bind(postsControllerInstance),
  )
  //DELETE
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.deletePost.bind(postsControllerInstance),
  )
  .get(
    "/:id/comments",
    idValidation,
    paginationSortingValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.getPostComments.bind(postsControllerInstance),
  )
  //TODO add validation for dto
  .post(
    "/:id/comments",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    postsControllerInstance.createPostComment.bind(postsControllerInstance),
  );
