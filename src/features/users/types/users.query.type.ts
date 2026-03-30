import type { PaginationAndSorting } from "../../../core/types/pagination-and-sorting.type";
import type { UserSortFields } from "./users.sort-field.type";

export type UsersQueryInput = PaginationAndSorting<UserSortFields> & {
  searchLoginTerm: string;
  searchEmailTerm: string;
};
