import { WithId } from "mongodb";
import { BlogDb } from "../../types/blogs.db.type";
import { mapEntityToViewModel } from "./blogs.entity-map";
import { Paginator } from "../../../../core/types/paginator.type";
import { BlogView } from "../../types/blogs.view.type";

export const mapBlogsToPaginatedView = (
  dbEntities: WithId<BlogDb>[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
): Paginator<BlogView> => {
  const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

  const mappedBlogs = dbEntities.map(mapEntityToViewModel);

  return {
    items: mappedBlogs,
    pagesCount,
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
  };
};
