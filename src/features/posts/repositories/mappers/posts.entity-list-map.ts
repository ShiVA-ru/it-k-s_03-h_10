import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type";
import type { PostDb } from "../../types/posts.db.type";
import type { PostView } from "../../types/posts.view.type";
import { mapEntityToViewModel } from "./posts.entity-map";

export const mapPostsToPaginatedView = (
  dbEntities: WithId<PostDb>[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
): Paginator<PostView> => {
  const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

  const mappedPosts = dbEntities.map(mapEntityToViewModel);

  return {
    items: mappedPosts,
    pagesCount,
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
  };
};
