import type { CommentatorInfoType } from "./comments.commentator-info.type";

export type CommentDb = {
  content: string;
  commentatorInfo: CommentatorInfoType;
  postId: string;
  createdAt?: string;
};
