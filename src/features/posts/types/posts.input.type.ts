import { PostView } from "./posts.view.type";

export type PostInput = Omit<PostView, "id" | "blogName" | "createdAt">;
