import type { CommentatorInfoType } from "./comments.commentator-info.type";

export type CommentView = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt?: string;
};
