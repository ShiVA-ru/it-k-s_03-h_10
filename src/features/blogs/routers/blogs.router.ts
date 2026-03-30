import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { blogPostInputDtoValidation } from "../../posts/validation/posts.input-dto.validation.middleware";
import { paginationSortingValidation } from "../../posts/validation/posts.query.validation.middleware";
import { blogInputDtoValidation } from "../validation/blogs.input-dto.validation.middleware";
import { paginationSortingSearchValidation } from "../validation/blogs.query.validation.middleware";
import { createBlogHandler } from "./handlers/blogs.create.handler";
import { deleteBlogHandler } from "./handlers/blogs.delete.handler";
import { getBlogHandler } from "./handlers/blogs.get.handler";
import { getBlogListHandler } from "./handlers/blogs.get-list.handler";
import { updateBlogHandler } from "./handlers/blogs.update.handler";
import { createBlogPostHandler } from "./handlers/blogs-posts.create.handler";
import { getBlogPostsListHandler } from "./handlers/blogs-posts.get-list.handler";

export const blogsRouter = Router();

blogsRouter
  .post(
    "/",
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )

  .get(
    "/",
    paginationSortingSearchValidation,
    inputValidationResultMiddleware,
    getBlogListHandler,
  )

  .get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler)

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )

  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  )

  .get(
    "/:id/posts",
    paginationSortingValidation,
    inputValidationResultMiddleware,
    getBlogPostsListHandler,
  )

  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    blogPostInputDtoValidation,
    inputValidationResultMiddleware,
    createBlogPostHandler,
  );
