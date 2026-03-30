import { type Collection, type Db, MongoClient } from "mongodb";
import config from "../core/settings/config";
import type { BlogDb } from "../features/blogs/types/blogs.db.type";
import type { CommentDb } from "../features/comments/types/comments.db.type";
import type { DeviceDb } from "../features/devices/types/devices.db.type";
import type { PostDb } from "../features/posts/types/posts.db.type";
import type { UserDb } from "../features/users/types/users.db.type";

export let client: MongoClient;
export let blogsCollection: Collection<BlogDb>;
export let postsCollection: Collection<PostDb>;
export let usersCollection: Collection<UserDb>;
export let commentsCollection: Collection<CommentDb>;
export let requestsCollection: Collection<{
  ip: string;
  url: string;
  date: Date;
}>;
export let devicesCollection: Collection<DeviceDb>;

export async function runDB(url: string) {
  client = new MongoClient(url);
  const db: Db = client.db(config.dbName);

  blogsCollection = db.collection<BlogDb>(config.blogCollectionName);
  postsCollection = db.collection<PostDb>(config.postCollectionName);
  usersCollection = db.collection<UserDb>(config.userCollectionName);
  commentsCollection = db.collection<CommentDb>(config.commentCollectionName);
  requestsCollection = db.collection(config.requestCollectionName);
  devicesCollection = db.collection(config.deviceCollectionName);

  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log("✅ Connected to the database");
  } catch (error) {
    console.error(error);
    await client.close();
    throw new Error(`❌ Database not connected: ${error}`);
  }
}

export async function closeDB() {
  try {
    await client.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database:", error);
  }
}
