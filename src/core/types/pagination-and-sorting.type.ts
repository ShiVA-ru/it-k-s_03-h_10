import { SortDirection } from "./sort-direction.type";

export type PaginationAndSorting<T> = {
  pageNumber: number;
  pageSize: number;
  sortBy: T;
  sortDirection: SortDirection;
};
