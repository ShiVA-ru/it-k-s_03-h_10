import { ObjectId } from "mongodb";
import type { Paginator } from "../../../core/types/paginator.type";
import { buildDbQueryOptions } from "../../../core/utils/build-db-query-options";
import { postsCollection } from "../../../db/mongo";
import type { PostsQueryInput } from "../types/posts.query.type";
import type { PostView } from "../types/posts.view.type";
import { mapPostsToPaginatedView } from "./mappers/posts.entity-list-map";
import { mapEntityToViewModel } from "./mappers/posts.entity-map";

export const postsQueryRepository = {
  async findAll(queryDto: PostsQueryInput): Promise<Paginator<PostView>> {
    const { skip, limit, sort } = buildDbQueryOptions(queryDto);
    const filter = {};

    const items = await postsCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);

    const postsListOutput = mapPostsToPaginatedView(items, {
      pageSize: queryDto.pageSize,
      page: queryDto.pageNumber,
      totalCount,
    });

    return postsListOutput;
  },

  async findOneById(id: string): Promise<PostView | null> {
    const item = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return mapEntityToViewModel(item);
  },

  async findByBlogId(
    blogId: string,
    queryDto: PostsQueryInput,
  ): Promise<Paginator<PostView>> {
    const { skip, limit, sort } = buildDbQueryOptions(queryDto);

    const filter = { blogId: blogId };

    const items = await postsCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray();

    const totalCount = await postsCollection.countDocuments(filter);

    const postsListOutput = mapPostsToPaginatedView(items, {
      pageSize: queryDto.pageSize,
      page: queryDto.pageNumber,
      totalCount,
    });

    return postsListOutput;
  },
};
