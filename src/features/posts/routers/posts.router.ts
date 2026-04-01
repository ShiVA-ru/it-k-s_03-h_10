import { Router } from "express";
import { postsController } from "../../../composition-root";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { accessTokenGuardMiddleware } from "../../auth/middlewares/access-token.guard";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { commentInputDtoValidation } from "../../comments/validation/comments.input-dto.validation.middleware";
import { postInputDtoValidation } from "../validation/posts.input-dto.validation.middleware";
import { paginationSortingValidation } from "../validation/posts.query.validation.middleware";

export const postsRouter = Router();

//Заменить тип Response PostView на DTO

postsRouter
  //CREATE
  .post(
    "/",
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.createPost.bind(postsController),
  )
  //READ
  .get(
    "/",
    paginationSortingValidation,
    inputValidationResultMiddleware,
    postsController.getPosts.bind(postsController),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    postsController.getPost.bind(postsController),
  )
  //UPDATE
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.updatePost.bind(postsController),
  )
  //DELETE
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsController.deletePost.bind(postsController),
  )
  .get(
    "/:id/comments",
    idValidation,
    paginationSortingValidation,
    inputValidationResultMiddleware,
    postsController.getPostComments.bind(postsController),
  )
  //TODO add validation for dto
  .post(
    "/:id/comments",
    accessTokenGuardMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.createPostComment.bind(postsController),
  );
