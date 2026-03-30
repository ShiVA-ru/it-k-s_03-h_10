import { ObjectId } from "mongodb";
import type { Paginator } from "../../../core/types/paginator.type";
import { buildDbQueryOptions } from "../../../core/utils/build-db-query-options";
import { commentsCollection } from "../../../db/mongo";
import type { CommentsQueryInput } from "../types/comments.query.type";
import type { CommentView } from "../types/comments.view.type";
import { mapCommentsToPaginatedView } from "./mappers/comments.entity-list-map";
import { mapEntityToViewModel } from "./mappers/comments.entity-map";

export const commentsQueryRepository = {
  async findAll(queryDto: CommentsQueryInput): Promise<Paginator<CommentView>> {
    const { skip, limit, sort } = buildDbQueryOptions(queryDto);
    const filter = {};

    const items = await commentsCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    const commentsListOutput = mapCommentsToPaginatedView(items, {
      pageSize: queryDto.pageSize,
      page: queryDto.pageNumber,
      totalCount,
    });

    return commentsListOutput;
  },

  async findOneById(id: string): Promise<CommentView | null> {
    const item = await commentsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return mapEntityToViewModel(item);
  },

  async findByPostId(
    postId: string,
    queryDto: CommentsQueryInput,
  ): Promise<Paginator<CommentView>> {
    const { skip, limit, sort } = buildDbQueryOptions(queryDto);

    const filter = { postId: postId };

    const items = await commentsCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray();

    const totalCount = await commentsCollection.countDocuments(filter);

    const postsListOutput = mapCommentsToPaginatedView(items, {
      pageSize: queryDto.pageSize,
      page: queryDto.pageNumber,
      totalCount,
    });

    return postsListOutput;
  },
};
