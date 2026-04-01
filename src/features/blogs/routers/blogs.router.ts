import { Router } from "express";
import { blogsController } from "../../../composition-root";
import { inputValidationResultMiddleware } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../../core/middlewares/validation/params-id-validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard";
import { blogPostInputDtoValidation } from "../../posts/validation/posts.input-dto.validation.middleware";
import { paginationSortingValidation } from "../../posts/validation/posts.query.validation.middleware";
import { blogInputDtoValidation } from "../validation/blogs.input-dto.validation.middleware";
import { paginationSortingSearchValidation } from "../validation/blogs.query.validation.middleware";

export const blogsRouter = Router();

blogsRouter
  .post(
    "/",
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.createBlog.bind(blogsController),
  )

  .get(
    "/",
    paginationSortingSearchValidation,
    inputValidationResultMiddleware,
    blogsController.getBlogs.bind(blogsController),
  )

  .get(
    "/:id",
    idValidation,
    inputValidationResultMiddleware,
    blogsController.getBlog.bind(blogsController),
  )

  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.updateBlog.bind(blogsController),
  )

  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    blogsController.deleteBlog.bind(blogsController),
  )

  .get(
    "/:id/posts",
    paginationSortingValidation,
    inputValidationResultMiddleware,
    blogsController.getBlogsPosts.bind(blogsController),
  )

  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    blogPostInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.createBlogPost.bind(blogsController),
  );
