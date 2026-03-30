import { WithId } from "mongodb";
import { BlogDb } from "../../types/blogs.db.type";
import { BlogView } from "../../types/blogs.view.type";

export const mapEntityToViewModel = (dbEntity: WithId<BlogDb>): BlogView => ({
  id: dbEntity._id.toString(),
  name: dbEntity.name,
  description: dbEntity.description,
  websiteUrl: dbEntity.websiteUrl,
  createdAt: dbEntity.createdAt.toString(),
  isMembership: dbEntity.isMembership,
});
