import type { DeviceMeta } from "../../../core/types/device-meta.types";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { isSuccessResult } from "../../../core/utils/type-guards";
import type { DevicesService } from "../../devices/application/devices.service";
import type { DevicesRepository } from "../../devices/repositories/devices.repository";
import { mapEntityToViewModel } from "../../users/repositories/mappers/users.entity-map";
import type { UsersRepository } from "../../users/repositories/users.repository";
import type { UserView } from "../../users/types/users.view.type";
import type { TokenPair } from "../types/token-pair.type";
import { bcryptService } from "./bcrypt.service";
import { jwtService } from "./jwt.service";

export class AuthService {
  constructor(
    private devicesRepository: DevicesRepository,
    private usersRepository: UsersRepository,
    private devicesService: DevicesService,
  ) {}

  async loginUser(
    loginOrEmail: string,
    password: string,
    deviceMeta: DeviceMeta,
  ): Promise<Result<TokenPair | null>> {
    const now = Math.floor(Date.now() / 1000);

    const userCredentialsResult = await this.checkUserCredentials(
      loginOrEmail,
      password,
    );

    if (!isSuccessResult(userCredentialsResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Credentials is not correct",
        extensions: [],
        data: null,
      };
    }
    const userId = userCredentialsResult.data.id;

    const createSessionResult = await this.devicesService.create(
      {
        ...deviceMeta,
        userId,
      },
      now,
    );

    if (!isSuccessResult(createSessionResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Credentials is not correct",
        extensions: [],
        data: null,
      };
    }

    const deviceId = createSessionResult.data.insertedId;

    const tokensResult = await jwtService.generateTokens(userId, deviceId, now);

    if (!isSuccessResult(tokensResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create jwt token",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        accessToken: tokensResult.data.accessToken,
        refreshToken: tokensResult.data.refreshToken,
        iat: now,
      },
    };
  }

  async logoutByDevice(
    userId: string,
    deviceId: string,
  ): Promise<Result<true | null>> {
    try {
      const isDeleted = await this.devicesRepository.deleteOneById(
        deviceId,
        userId,
      );

      if (!isDeleted) {
        return {
          status: ResultStatus.NotFound,
          errorMessage: "Device not found",
          extensions: [],
          data: null,
        };
      }

      return {
        status: ResultStatus.Success,
        extensions: [],
        data: true,
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: "InternalServerError",
        extensions: [],
        data: null,
      };
    }
  }

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<UserView | null>> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user)
      return {
        status: ResultStatus.NotFound,
        errorMessage: "User with this credentials is not found",
        extensions: [],
        data: null,
      };

    const checkPassword = await bcryptService.checkPassword(
      password,
      user.password,
    );

    if (!checkPassword) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "User password is not correct",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: mapEntityToViewModel(user),
    };
  }

  async updateTokens(
    userId: string,
    deviceId: string,
  ): Promise<Result<TokenPair | null>> {
    const now = Math.floor(Date.now() / 1000);

    const tokensResult = await jwtService.generateTokens(userId, deviceId, now);

    if (!isSuccessResult(tokensResult)) {
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create jwt token",
        extensions: [],
        data: null,
      };
    }

    const isUpdated = await this.devicesRepository.update(deviceId, now);

    if (!isUpdated) {
      return {
        status: ResultStatus.NotFound,
        errorMessage: "Can't create jwt token",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        accessToken: tokensResult.data.accessToken,
        refreshToken: tokensResult.data.refreshToken,
        iat: now,
      },
    };
  }
}
