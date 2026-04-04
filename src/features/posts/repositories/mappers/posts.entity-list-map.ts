import type { WithId } from "mongodb";
import type { Paginator } from "../../../../core/types/paginator.type.js";
import type { PostDb } from "../../types/posts.db.type.js";
import type { PostView } from "../../types/posts.view.type.js";
import { mapEntityToViewModel } from "./posts.entity-map.js";

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
