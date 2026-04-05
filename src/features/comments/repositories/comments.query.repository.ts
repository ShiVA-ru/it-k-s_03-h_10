import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import type { Paginator } from "../../../core/types/paginator.type.js";
import { buildDbQueryOptions } from "../../../core/utils/build-db-query-options.js";
import { commentsCollection } from "../../../db/mongo.js";
import type { CommentsQueryInput } from "../types/comments.query.type.js";
import type { CommentView } from "../types/comments.view.type.js";
import { mapCommentsToPaginatedView } from "./mappers/comments.entity-list-map.js";
import { mapEntityToViewModel } from "./mappers/comments.entity-map.js";

@injectable()
export class CommentsQueryRepository {
	async findAll(queryDto: CommentsQueryInput): Promise<Paginator<CommentView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);
		const filter = {};

		const items = await commentsCollection
			.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.toArray();

		const totalCount = await commentsCollection.countDocuments(filter);

		const commentsListOutput = mapCommentsToPaginatedView(items, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		});

		return commentsListOutput;
	}

	async findOneById(id: string): Promise<CommentView | null> {
		const item = await commentsCollection.findOne({ _id: new ObjectId(id) });

		if (!item) {
			return null;
		}

		return mapEntityToViewModel(item);
	}

	async findByPostId(
		postId: string,
		queryDto: CommentsQueryInput,
	): Promise<Paginator<CommentView>> {
		const { skip, limit, sort } = buildDbQueryOptions(queryDto);

		const filter = { postId: postId };

		const items = await commentsCollection
			.find(filter)
			.skip(skip)
			.limit(limit)
			.sort(sort)
			.toArray();

		const totalCount = await commentsCollection.countDocuments(filter);

		const postsListOutput = mapCommentsToPaginatedView(items, {
			pageSize: queryDto.pageSize,
			page: queryDto.pageNumber,
			totalCount,
		});

		return postsListOutput;
	}
}
