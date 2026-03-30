import { BlogView } from "./blogs.view.type";

export type BlogInput = Omit<BlogView, "id" | "createdAt" | "isMembership">;
