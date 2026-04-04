import type { WithId } from "mongodb";
import type { BlogDb } from "../../types/blogs.db.type.js";
import type { BlogView } from "../../types/blogs.view.type.js";

export const mapEntityToViewModel = (dbEntity: WithId<BlogDb>): BlogView => ({
	id: dbEntity._id.toString(),
	name: dbEntity.name,
	description: dbEntity.description,
	websiteUrl: dbEntity.websiteUrl,
	createdAt: dbEntity.createdAt.toString(),
	isMembership: dbEntity.isMembership,
});
