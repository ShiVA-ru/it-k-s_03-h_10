import { SortDirection } from "../../../core/types/sort-direction.type";
import { CommentSortFields } from "../types/comments.sort-field.type";

const DEFAULT_SORT_BY = CommentSortFields.CREATED_AT;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export const defaultPostsFilter = {
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
};
