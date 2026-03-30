import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { Paginator } from "../../../../core/types/paginator.type";
import { postsQueryRepository } from "../../../posts/repositories/posts.query.repository";
import type { PostsQueryInput } from "../../../posts/types/posts.query.type";
import type { PostView } from "../../../posts/types/posts.view.type";
import { blogsQueryRepository } from "../../repositories/blogs.query.repository";

export async function getBlogPostsListHandler(
  req: Request,
  res: Response<Paginator<PostView>>,
) {
  try {
    const blogId = req.params.id.toString();
    const blog = await blogsQueryRepository.findOneById(blogId);

    if (!blog) {
      return res.sendStatus(HttpStatus.NotFound);
    }
    const queryData = matchedData<PostsQueryInput>(req, {
      locations: ["query"],
    });

    const postsListOutput = await postsQueryRepository.findByBlogId(
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
