import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { bcryptService } from "../../auth/application/bcrypt.service";
import { usersRepository } from "../repositories/users.repository";
import type { UserDb } from "../types/users.db.type";
import type { UserInput } from "../types/users.input.type";

export const usersService = {
  async create(
    dto: UserInput,
    isAdmin: boolean = false,
  ): Promise<Result<{ insertedId: string } | null>> {
    const { login, password, email } = dto;

    const passwordHash = await bcryptService.generateHash(password);

    const newEntity: UserDb = {
      login,
      email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
      isEmailConfirmed: isAdmin,
      confirmationCode: isAdmin ? null : randomUUID(),
      confirmationCodeExpirationDate: isAdmin
        ? null
        : dayjs().add(1, "hour").toISOString(),
    };

    const insertedId = await usersRepository.create(newEntity);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { insertedId },
    };
  },

  async deleteOneById(id: string): Promise<boolean> {
    return await usersRepository.deleteOneById(id);
  },

  async findById(id: string): Promise<UserDb | null> {
    return await usersRepository.findOneById(id);
  },
};
