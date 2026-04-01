import { Router } from "express";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { blogPostInputDtoValidation } from "../../posts/validation/posts.input-dto.validation.middleware";
import { paginationSortingValidation } from "../../posts/validation/posts.query.validation.middleware";
import { blogInputDtoValidation } from "../validation/blogs.input-dto.validation.middleware";
import { paginationSortingSearchValidation } from "../validation/blogs.query.validation.middleware";
import { blogsControllerInstance } from "./blogs.controller";

export const blogsRouter = Router();

blogsRouter
  .post(
    "/",
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsControllerInstance.createBlog.bind(blogsControllerInstance),
  )

  .get(
    "/",
    paginationSortingSearchValidation,
    inputValidationResultMiddleware,
    blogsControllerInstance.getBlogs.bind(blogsControllerInstance),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    blogsControllerInstance.getBlog.bind(blogsControllerInstance),
  )

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsControllerInstance.updateBlog.bind(blogsControllerInstance),
  )

  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    blogsControllerInstance.deleteBlog.bind(blogsControllerInstance),
  )

  .get(
    "/:id/posts",
    paginationSortingValidation,
    inputValidationResultMiddleware,
    blogsControllerInstance.getBlogsPosts.bind(blogsControllerInstance),
  )

  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    blogPostInputDtoValidation,
    inputValidationResultMiddleware,
    blogsControllerInstance.createBlogPost.bind(blogsControllerInstance),
  );
