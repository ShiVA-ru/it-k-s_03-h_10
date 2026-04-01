import { ObjectId } from "mongodb";
import { commentsCollection } from "../../../db/mongo";
import type { CommentDb } from "../types/comments.db.type";
import type { CommentInput } from "../types/comments.input.type";

export class CommentsRepository {
  async create(dto: CommentDb): Promise<string> {
    const result = await commentsCollection.insertOne(dto);

    return result.insertedId.toString();
  }

  async updateById(id: string, dto: CommentInput): Promise<boolean> {
    const updateResult = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: dto.content,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      return false;
    }

    return true;
  }

  async deleteOneById(id: string): Promise<boolean> {
    const deleteResult = await commentsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      return false;
    }

    return true;
  }

  async deleteByPostId(blogId: string): Promise<void> {
    const deleteResult = await commentsCollection.deleteMany({
      blogId: blogId,
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error("Comment not exist");
    }

    return;
  }

  async findOneById(id: string): Promise<CommentDb | null> {
    const item = await commentsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return item;
  }
}
