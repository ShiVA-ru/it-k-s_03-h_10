import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { bcryptService } from "../../auth/application/bcrypt.service";
import { usersRepository } from "../repositories/users.repository";
import { UserDb } from "../types/users.db.type";
import type { UserInput } from "../types/users.input.type";

// export const usersServiceInstance = {
//   async create(
//     dto: UserInput,
//     isAdmin: boolean = false,
//   ): Promise<Result<{ insertedId: string } | null>> {
//     const { login, password, email } = dto;

//     const passwordHash = await bcryptService.generateHash(password);

//     const newEntity = new UserDb(login, email, passwordHash, isAdmin);

//     const insertedId = await usersRepository.create(newEntity);

//     return {
//       status: ResultStatus.Success,
//       extensions: [],
//       data: { insertedId },
//     };
//   },

//   async deleteOneById(id: string): Promise<boolean> {
//     return await usersRepository.deleteOneById(id);
//   },

//   async findById(id: string): Promise<UserDb | null> {
//     return await usersRepository.findOneById(id);
//   },
// };

export class UsersService {
  async create(
    dto: UserInput,
    isAdmin: boolean = false,
  ): Promise<Result<{ insertedId: string } | null>> {
    const { login, password, email } = dto;

    const passwordHash = await bcryptService.generateHash(password);

    const newEntity = new UserDb(login, email, passwordHash, isAdmin);

    const insertedId = await usersRepository.create(newEntity);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { insertedId },
    };
  }

  async deleteOneById(id: string): Promise<boolean> {
    return await usersRepository.deleteOneById(id);
  }

  async findById(id: string): Promise<UserDb | null> {
    return await usersRepository.findOneById(id);
  }
}

export const usersServiceInstance = new UsersService();
