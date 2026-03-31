import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import type { validationErrorsDto } from "../../../core/types/errors.types";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import type { IdType } from "../../../core/types/id.types";
import type { Paginator } from "../../../core/types/paginator.type";
import type {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsBodyUserId,
} from "../../../core/types/request.types";
import type { URIParamsId } from "../../../core/types/uri-params.type";
import { isSuccessResult } from "../../../core/utils/type-guards";
import { commentsService } from "../../comments/application/comments.service";
import { commentsQueryRepository } from "../../comments/repositories/comments.query.repository";
import type { CommentInput } from "../../comments/types/comments.input.type";
import type { CommentsQueryInput } from "../../comments/types/comments.query.type";
import type { CommentView } from "../../comments/types/comments.view.type";
import { postsServiceInstance } from "../application/posts.service";
import { postsQueryRepositoryInstance } from "../repositories/posts.query.repository";
import { postsRepositoryInstance } from "../repositories/posts.repository";
import type { PostInput } from "../types/posts.input.type";
import type { PostsQueryInput } from "../types/posts.query.type";
import type { PostView } from "../types/posts.view.type";

class PostsController {
  async getPost(
    req: RequestWithParams<URIParamsId>,
    res: Response<PostView | validationErrorsDto>,
  ) {
    try {
      const findEntity = await postsQueryRepositoryInstance.findOneById(
        req.params.id,
      );

      if (!findEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      return res.status(HttpStatus.Ok).json(findEntity);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }

  async getPosts(req: Request, res: Response<Paginator<PostView>>) {
    try {
      const queryData = matchedData<PostsQueryInput>(req, {
        locations: ["query"],
      });

      const postsListOutput =
        await postsQueryRepositoryInstance.findAll(queryData);

      res.status(HttpStatus.Ok).json(postsListOutput);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async getPostComments(
    req: RequestWithParams<IdType>,
    res: Response<Paginator<CommentView>>,
  ) {
    try {
      const postId = req.params.id;
      const queryData = matchedData<CommentsQueryInput>(req, {
        locations: ["query"],
      });

      const queryPost = await postsRepositoryInstance.findOneById(postId);

      if (!queryPost) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const commentsListOutput = await commentsQueryRepository.findByPostId(
        postId,
        queryData,
      );

      return res.status(HttpStatus.Ok).json(commentsListOutput);
    } catch (error) {
      console.error(error);
      return res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async createPost(
    req: RequestWithBody<PostInput>,
    res: Response<PostView | validationErrorsDto>,
  ) {
    try {
      const insertedId = await postsServiceInstance.create(req.body);

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

  async createPostComment(
    req: RequestWithParamsBodyUserId<URIParamsId, CommentInput, IdType>,
    res: Response<CommentView>,
  ) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const postId = req.params.id;

      if (!postId) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const createResult = await commentsService.create(
        userId,
        postId,
        req.body,
      );

      if (!isSuccessResult(createResult)) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      const createdEntity = await commentsQueryRepository.findOneById(
        createResult.data.id,
      );

      if (!createdEntity) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      return res.status(HttpStatus.Created).json(createdEntity);
    } catch (error) {
      console.error(error);
      return res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async updatePost(
    req: RequestWithParamsAndBody<URIParamsId, PostInput>,
    res: Response<PostView | validationErrorsDto | { message: string }>,
  ) {
    try {
      const updateStatus = await postsServiceInstance.updateById(
        req.params.id,
        req.body,
      );

      if (updateStatus.notFound) {
        return res
          .status(HttpStatus.NotFound)
          .send({ message: `${updateStatus.entity} not found` });
      }

      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deletePost(req: RequestWithParams<URIParamsId>, res: Response) {
    try {
      const isDeleted = await postsServiceInstance.deleteOneById(req.params.id);

      if (!isDeleted) {
        return res.sendStatus(HttpStatus.NotFound);
      }

      return res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }
}

export const postsControllerInstance = new PostsController();
