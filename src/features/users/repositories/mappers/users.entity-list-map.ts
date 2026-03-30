import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type";
import type { UserDb } from "../../types/users.db.type";
import type { UserView } from "../../types/users.view.type";
import { mapEntityToViewModel } from "./users.entity-map";

export const mapUsersToPaginatedView = (
  dbEntities: WithId<UserDb>[],
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
  },
): Paginator<UserView> => {
  const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

  const mappedUsers = dbEntities.map(mapEntityToViewModel);

  return {
    items: mappedUsers,
    pagesCount,
    page: meta.page,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
  };
};
