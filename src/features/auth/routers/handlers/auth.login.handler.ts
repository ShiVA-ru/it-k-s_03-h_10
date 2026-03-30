import type { Response } from "express";
import { HttpStatus } from "../../../../core/types/http-statuses.types";
import type { RequestWithBody } from "../../../../core/types/request.types";
import { isSuccessResult } from "../../../../core/utils/type-guards";
import { authService } from "../../application/auth.service";
import type { LoginInput } from "../../types/login.input.type";

export const loginHandler = async (
  req: RequestWithBody<LoginInput>,
  res: Response,
) => {
  try {
    const { loginOrEmail, password } = req.body;
    console.log("req.deviceMeta", req.deviceMeta);

    const result = await authService.loginUser(
      loginOrEmail,
      password,
      req.deviceMeta,
    );

    if (!isSuccessResult(result)) {
      return res.sendStatus(HttpStatus.Unauthorized);
    }
    res.cookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return res
      .status(HttpStatus.Ok)
      .json({ accessToken: result.data.accessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
