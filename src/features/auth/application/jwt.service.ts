import jwt from "jsonwebtoken";
import config from "../../../core/settings/config";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import type { TokenPair } from "../types/token-pair.type";
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../types/token-payload.type";

export const jwtService = {
  async generateTokens(
    userId: string,
    deviceId: string,
    iat: number,
  ): Promise<Result<TokenPair | null>> {
    const now = Math.floor(Date.now() / 1000);

    try {
      const accessToken = jwt.sign({ userId }, config.jwtPrivateKey, {
        expiresIn: +config.accessTokenExpireTime,
      });

      const refreshToken = jwt.sign(
        { userId, deviceId, iat },
        config.jwtPrivateKey,
        {
          expiresIn: +config.refreshTokenExpireTime,
          // noTimestamp: true
        },
      );

      return {
        status: ResultStatus.Success,
        extensions: [],
        data: { accessToken, refreshToken, iat: now },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't create token",
        extensions: [],
        data: null,
      };
    }
  },

  async verifyAccessToken(
    token: string,
  ): Promise<Result<AccessTokenPayload | null>> {
    try {
      const verified = jwt.verify(
        token,
        config.jwtPrivateKey,
      ) as AccessTokenPayload;

      console.log("decode", jwt.decode(token));
      console.log("verified", verified);
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: verified,
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't verified token",
        extensions: [],
        data: null,
      };
    }
  },

  async verifyRefreshToken(
    token: string,
  ): Promise<Result<RefreshTokenPayload | null>> {
    try {
      const decoded = jwt.verify(
        token,
        config.jwtPrivateKey,
      ) as RefreshTokenPayload;

      console.log("decoded", jwt.decode(token));
      console.log("decoded", decoded);
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: decoded,
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResultStatus.Forbidden,
        errorMessage: "Can't verified token",
        extensions: [],
        data: null,
      };
    }
  },
};
