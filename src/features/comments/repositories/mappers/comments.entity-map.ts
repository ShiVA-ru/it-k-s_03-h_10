import type { WithId } from "mongodb";
import type { CommentDb } from "../../types/comments.db.type";
import type { CommentView } from "../../types/comments.view.type";

export const mapEntityToViewModel = (
  dbEntity: WithId<CommentDb>,
): CommentView => ({
  id: dbEntity._id.toString(),
  content: dbEntity.content,
  commentatorInfo: dbEntity.commentatorInfo,
  createdAt: dbEntity.createdAt,
});
