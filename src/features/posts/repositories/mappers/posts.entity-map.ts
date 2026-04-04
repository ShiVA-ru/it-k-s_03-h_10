import type { WithId } from "mongodb";
import type { PostDb } from "../../types/posts.db.type.js";
import type { PostView } from "../../types/posts.view.type.js";

export const mapEntityToViewModel = (dbEntity: WithId<PostDb>): PostView => ({
	id: dbEntity._id.toString(),
	title: dbEntity.title,
	shortDescription: dbEntity.shortDescription,
	content: dbEntity.content,
	blogId: dbEntity.blogId,
	blogName: dbEntity.blogName,
	createdAt: dbEntity.createdAt,
});
