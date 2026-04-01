import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { bcryptService } from "../../auth/application/bcrypt.service";
import { UsersRepository } from "../repositories/users.repository";
import { UserDb } from "../types/users.db.type";
import type { UserInput } from "../types/users.input.type";

export class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create(
    dto: UserInput,
    isAdmin: boolean = false,
  ): Promise<Result<{ insertedId: string } | null>> {
    const { login, password, email } = dto;

    const passwordHash = await bcryptService.generateHash(password);

    const newEntity = new UserDb(login, email, passwordHash, isAdmin);

    const insertedId = await this.usersRepository.create(newEntity);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { insertedId },
    };
  }

  async deleteOneById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteOneById(id);
  }

  async findById(id: string): Promise<UserDb | null> {
    return await this.usersRepository.findOneById(id);
  }
}
