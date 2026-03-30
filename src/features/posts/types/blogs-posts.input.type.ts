import { PostView } from "./posts.view.type";

export type BlogPostInput = Omit<
  PostView,
  "id" | "blogName" | "createdAt" | "blogId"
>;
