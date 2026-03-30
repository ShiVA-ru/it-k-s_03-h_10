import type { WithId } from "mongodb";
import type { UserDb } from "../../types/users.db.type";
import type { UserView } from "../../types/users.view.type";

export const mapEntityToViewModel = (dbEntity: WithId<UserDb>): UserView => ({
  id: dbEntity._id.toString(),
  login: dbEntity.login,
  email: dbEntity.email,
  createdAt: dbEntity.createdAt.toString(),
});
