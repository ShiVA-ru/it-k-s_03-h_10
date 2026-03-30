import type { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type";
import type { PostSortFields } from "./posts.sort-field.type";

export type PostsQueryInput = PaginationAndSorting<PostSortFields>;
