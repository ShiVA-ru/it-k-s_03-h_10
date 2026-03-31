import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import type {
  validationErrorsDto,
  validationErrorType,
} from "../../../core/types/errors.types";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import type { Paginator } from "../../../core/types/paginator.type";
import type {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../../core/types/request.types";
import type { URIParamsId } from "../../../core/types/uri-params.type";
import { postsServiceInstance } from "../../posts/application/posts.service";
import { postsQueryRepositoryInstance } from "../../posts/repositories/posts.query.repository";
import type { BlogPostInput } from "../../posts/types/blogs-posts.input.type";
import type { PostsQueryInput } from "../../posts/types/posts.query.type";
import type { PostView } from "../../posts/types/posts.view.type";
import { blogsServiceInstance } from "../application/blogs.service";
import { blogsQueryRepositoryInstance } from "../repositories/blogs.query.repository";
import type { BlogInput } from "../types/blogs.input.type";
import type { BlogsQueryInput } from "../types/blogs.query.type";
import type { BlogView } from "../types/blogs.view.type";

class BlogsController {
  async getBlog(
    req: RequestWithParams<URIParamsId>,
    res: Response<BlogView | validationErrorsDto>,
  ) {
    try {
      const findEntity = await blogsQueryRepositoryInstance.findOneById(
        req.params.id,
      );

      if (!findEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      res.status(HttpStatus.Ok).json(findEntity);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }

  async getBlogs(req: Request, res: Response<Paginator<BlogView>>) {
    try {
      const queryData = matchedData<BlogsQueryInput>(req, {
        locations: ["query"],
      });

      const blogsListOutput =
        await blogsQueryRepositoryInstance.findAll(queryData);

      res.status(HttpStatus.Ok).json(blogsListOutput);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async getBlogsPosts(req: Request, res: Response<Paginator<PostView>>) {
    try {
      const blogId = req.params.id.toString();
      const blog = await blogsQueryRepositoryInstance.findOneById(blogId);

      if (!blog) {
        return res.sendStatus(HttpStatus.NotFound);
      }
      const queryData = matchedData<PostsQueryInput>(req, {
        locations: ["query"],
      });

      const postsListOutput = await postsQueryRepositoryInstance.findByBlogId(
        blogId,
        queryData,
      );

      if (!postsListOutput) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      res.status(HttpStatus.Ok).json(postsListOutput);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async createBlog(
    req: RequestWithBody<BlogInput>,
    res: Response<BlogView | validationErrorType>,
  ) {
    try {
      const insertedId = await blogsServiceInstance.create(req.body);

      const createdEntity =
        await blogsQueryRepositoryInstance.findOneById(insertedId);

      if (!createdEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      res.status(HttpStatus.Created).json(createdEntity);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async createBlogPost(
    req: RequestWithParamsAndBody<URIParamsId, BlogPostInput>,
    res: Response<PostView | validationErrorsDto>,
  ) {
    try {
      const blogId = req.params.id;
      const insertedId = await postsServiceInstance.create({
        blogId,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
      });

      if (!insertedId) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const createdEntity =
        await postsQueryRepositoryInstance.findOneById(insertedId);

      if (!createdEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      res.status(HttpStatus.Created).json(createdEntity);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async updateBlog(
    req: RequestWithParamsAndBody<URIParamsId, BlogInput>,
    res: Response<BlogView | validationErrorsDto>,
  ) {
    try {
      const isUpdated = await blogsServiceInstance.updateById(
        req.params.id,
        req.body,
      );

      if (!isUpdated) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }

      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }

  async deleteBlog(req: RequestWithParams<URIParamsId>, res: Response) {
    try {
      const isDeleted = await blogsServiceInstance.deleteOneById(req.params.id);

      if (!isDeleted) {
        res.sendStatus(HttpStatus.NotFound);
        return;
      }

      return res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }
}

export const blogsControllerInstance = new BlogsController();
