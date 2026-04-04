import type { CommentatorInfoType } from "./comments.commentator-info.type.js";

export type CommentView = {
	id: string;
	content: string;
	commentatorInfo: CommentatorInfoType;
	createdAt?: string;
};
