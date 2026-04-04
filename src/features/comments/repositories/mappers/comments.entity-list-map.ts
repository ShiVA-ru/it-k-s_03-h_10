import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type.js";
import type { CommentDb } from "../../types/comments.db.type.js";
import type { CommentView } from "../../types/comments.view.type.js";
import { mapEntityToViewModel } from "./comments.entity-map.js";

export const mapCommentsToPaginatedView = (
	dbEntities: WithId<CommentDb>[],
	meta: {
		page: number;
		pageSize: number;
		totalCount: number;
	},
): Paginator<CommentView> => {
	const pagesCount = Math.ceil(meta.totalCount / meta.pageSize);

	const mappedComments = dbEntities.map(mapEntityToViewModel);

	return {
		items: mappedComments,
		pagesCount,
		page: meta.page,
		pageSize: meta.pageSize,
		totalCount: meta.totalCount,
	};
};
