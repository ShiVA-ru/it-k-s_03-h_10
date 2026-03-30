import type { Response } from "express";
import { matchedData } from "express-validator";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { Paginator } from "../../../../core/types/paginator.type";
import type { RequestWithParams } from "../../../../core/types/request.types";
import { commentsQueryRepository } from "../../../comments/repositories/comments.query.repository";
import type { CommentsQueryInput } from "../../../comments/types/comments.query.type";
import type { CommentView } from "../../../comments/types/comments.view.type";
import type { IdType } from "../../../../core/types/id.types";
import { postsRepository } from "../../repositories/posts.repository";

export async function getPostCommentsListHandler(
  req: RequestWithParams<IdType>,
  res: Response<Paginator<CommentView>>,
) {
  try {
    const postId = req.params.id;
    const queryData = matchedData<CommentsQueryInput>(req, {
      locations: ["query"],
    });

    const queryPost = await postsRepository.findOneById(postId);

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
