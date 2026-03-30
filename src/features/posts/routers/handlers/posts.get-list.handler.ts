import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { Paginator } from "../../../../core/types/paginator.type";
import { postsQueryRepository } from "../../repositories/posts.query.repository";
import type { PostsQueryInput } from "../../types/posts.query.type";
import type { PostView } from "../../types/posts.view.type";

export async function getPostListHandler(
  req: Request,
  res: Response<Paginator<PostView>>,
) {
  try {
    const queryData = matchedData<PostsQueryInput>(req, {
      locations: ["query"],
    });

    const postsListOutput = await postsQueryRepository.findAll(queryData);

    res.status(HttpStatus.Ok).json(postsListOutput);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
