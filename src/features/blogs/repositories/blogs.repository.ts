import { ObjectId } from "mongodb";
import { blogsCollection } from "../../../db/mongo";
import type { BlogDb } from "../types/blogs.db.type";
import type { BlogInput } from "../types/blogs.input.type";

export const blogsRepository = {
  async create(dto: BlogDb): Promise<string> {
    const result = await blogsCollection.insertOne(dto);

    return result.insertedId.toString();
  },

  async updateById(id: string, dto: BlogInput): Promise<boolean> {
    const updateResult = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      return false;
    }

    return true;
  },

  async deleteOneById(id: string): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      return false;
    }

    return true;
  },

  async findOneById(id: string): Promise<BlogDb | null> {
    const item = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return item;
  },
};
