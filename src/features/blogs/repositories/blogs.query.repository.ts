import { ObjectId } from "mongodb";
import type { Paginator } from "../../../core/types/paginator.type";
import { buildDbQueryOptions } from "../../../core/utils/build-db-query-options";
import { blogsCollection } from "../../../db/mongo";
import type { BlogsQueryInput } from "../types/blogs.query.type";
import type { BlogView } from "../types/blogs.view.type";
import { mapBlogsToPaginatedView } from "./mappers/blogs.entity-list-map";
import { mapEntityToViewModel } from "./mappers/blogs.entity-map";

export const blogsQueryRepository = {
  async findAll(queryDto: BlogsQueryInput): Promise<Paginator<BlogView>> {
    const { skip, limit, sort } = buildDbQueryOptions(queryDto);
    const searchConditions = [];
    if (queryDto.searchNameTerm) {
      searchConditions.push({
        name: { $regex: queryDto.searchNameTerm, $options: "i" },
      });
    }
    const filter = searchConditions.length ? { $or: searchConditions } : {};

    const items = await blogsCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);

    const blogsListOutput = mapBlogsToPaginatedView(items, {
      pageSize: queryDto.pageSize,
      page: queryDto.pageNumber,
      totalCount,
    });

    return blogsListOutput;
  },

  async findOneById(id: string): Promise<BlogView | null> {
    const item = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return mapEntityToViewModel(item);
  },
};
