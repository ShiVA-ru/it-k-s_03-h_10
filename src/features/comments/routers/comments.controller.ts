import type { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses.types";
import type { IdType } from "../../../core/types/id.types";
import type {
  RequestWithParams,
  RequestWithParamsBodyUserId,
  RequestWithParamsUserId,
} from "../../../core/types/request.types";
import type { URIParamsId } from "../../../core/types/uri-params.type";
import { resultCodeToHttpException } from "../../../core/utils/result-code-to-http-exception";
import { isSuccessResult } from "../../../core/utils/type-guards";
import { CommentsService } from "../application/comments.service";
import { CommentsQueryRepository } from "../repositories/comments.query.repository";
import type { CommentInput } from "../types/comments.input.type";
import type { CommentView } from "../types/comments.view.type";

class CommentsController {
  private commentsService: CommentsService;
  private commentsQueryRepository: CommentsQueryRepository;

  constructor() {
    this.commentsService = new CommentsService();
    this.commentsQueryRepository = new CommentsQueryRepository();
  }
  async getComment(
    req: RequestWithParams<URIParamsId>,
    res: Response<CommentView>,
  ) {
    try {
      const findEntity = await this.commentsQueryRepository.findOneById(
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

  async updateComment(
    req: RequestWithParamsBodyUserId<URIParamsId, CommentInput, IdType>,
    res: Response<CommentView | { message: string }>,
  ) {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(HttpStatus.NotFound).send({
          message: `user not found`,
        });
        return;
      }

      const updatedResult = await this.commentsService.updateById(
        userId,
        req.params.id,
        req.body,
      );

      if (!isSuccessResult(updatedResult)) {
        res.status(resultCodeToHttpException(updatedResult.status)).send({
          message: updatedResult.errorMessage ? updatedResult.errorMessage : "",
        });
        return;
      }

      res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.InternalServerError);
    }
  }

  async deleteComment(
    req: RequestWithParamsUserId<URIParamsId, IdType>,
    res: Response,
  ) {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(HttpStatus.NotFound).send({
          message: `user not found`,
        });
        return;
      }

      const deletedResult = await this.commentsService.deleteOneById(
        userId,
        req.params.id,
      );

      if (!isSuccessResult(deletedResult)) {
        res.status(resultCodeToHttpException(deletedResult.status)).send({
          message: deletedResult.errorMessage ? deletedResult.errorMessage : "",
        });
        return;
      }

      return res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
      console.error(error);
      res.sendStatus(HttpStatus.NotFound);
    }
  }
}

export const commentsControllerInstance = new CommentsController();
