import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { Paginator } from "../../../../core/types/paginator.type";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";
import type { BlogsQueryInput } from "../../types/blogs.query.type";
import type { BlogView } from "../../types/blogs.view.type";

export async function getBlogListHandler(
  req: Request,
  res: Response<Paginator<BlogView>>,
) {
  try {
    const queryData = matchedData<BlogsQueryInput>(req, {
      locations: ["query"],
    });

    const blogsListOutput = await blogsQueryRepository.findAll(queryData);

    res.status(HttpStatus.Ok).json(blogsListOutput);
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}
