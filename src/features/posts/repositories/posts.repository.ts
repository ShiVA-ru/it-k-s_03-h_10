import { injectable } from "inversify";
import { ObjectId, type WithId } from "mongodb";
import { postsCollection } from "../../../db/mongo.js";
import type { PostDb } from "../types/posts.db.type.js";

@injectable()
export class PostsRepository {
	async create(dto: PostDb): Promise<string> {
		const result = await postsCollection.insertOne(dto);

		return result.insertedId.toString();
	}

	async updateById(
		id: string,
		dto: Omit<PostDb, "createdAt">,
	): Promise<boolean> {
		const updateResult = await postsCollection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					title: dto.title,
					shortDescription: dto.shortDescription,
					content: dto.content,
					blogId: dto.blogId,
					blogName: dto.blogName,
				},
			},
		);

		if (updateResult.matchedCount < 1) {
			return false;
		}

		return true;
	}

	async deleteOneById(id: string): Promise<boolean> {
		const deleteResult = await postsCollection.deleteOne({
			_id: new ObjectId(id),
		});

		if (deleteResult.deletedCount < 1) {
			return false;
		}

		return true;
	}

	async deleteByBlogId(blogId: string): Promise<void> {
		const deleteResult = await postsCollection.deleteMany({
			blogId: blogId,
		});

		if (deleteResult.deletedCount < 1) {
			throw new Error("Post not exist");
		}

		return;
	}

	async findOneById(id: string): Promise<WithId<PostDb> | null> {
		const item = await postsCollection.findOne({ _id: new ObjectId(id) });

		if (!item) {
			return null;
		}

		return item;
	}
}
