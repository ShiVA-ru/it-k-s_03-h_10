import type { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type";
import type { CommentSortFields } from "./comments.sort-field.type";

export type CommentsQueryInput = PaginationAndSorting<CommentSortFields>;
