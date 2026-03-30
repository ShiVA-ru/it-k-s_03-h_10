import { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type";
import { BlogSortFields } from "./blogs.sort-field.type";

export type BlogsQueryInput = PaginationAndSorting<BlogSortFields> & {
  searchNameTerm: string;
};
