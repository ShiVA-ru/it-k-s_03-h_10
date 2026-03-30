import { ObjectId } from "mongodb";
import type { Paginator } from "../../../core/types/paginator.type";
import { buildDbQueryOptions } from "../../../core/utils/build-db-query-options";
import { usersCollection } from "../../../db/mongo";
import type { MeView } from "../../auth/types/me.view.type";
import type { UsersQueryInput } from "../types/users.query.type";
import type { UserView } from "../types/users.view.type";
import { mapUsersToPaginatedView } from "./mappers/users.entity-list-map";
import { mapEntityToViewModel } from "./mappers/users.entity-map";

export const usersQueryRepository = {
  async findAll(queryDto: UsersQueryInput): Promise<Paginator<UserView>> {
    const { skip, limit, sort } = buildDbQueryOptions(queryDto);
    const searchConditions = [];

    if (queryDto.searchLoginTerm) {
      searchConditions.push({
        login: { $regex: queryDto.searchLoginTerm, $options: "i" },
      });
    }
    if (queryDto.searchEmailTerm) {
      searchConditions.push({
        email: { $regex: queryDto.searchEmailTerm, $options: "i" },
      });
    }

    const filter = searchConditions.length ? { $or: searchConditions } : {};

    const items = await usersCollection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    const usersListOutput = mapUsersToPaginatedView(items, {
      pageSize: queryDto.pageSize,
      page: queryDto.pageNumber,
      totalCount,
    });

    return usersListOutput;
  },

  async findOneById(id: string): Promise<UserView | null> {
    const item = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return mapEntityToViewModel(item);
  },

  async findMeById(id: string): Promise<MeView | null> {
    const item = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return null;
    }

    return {
      userId: item._id.toString(),
      login: item.login,
      email: item.email,
    };
  },
};
