import { randomUUID } from "node:crypto";
import dayjs from "dayjs";
import { emailAdapter } from "../../../adapters/email.adapter";
import { ResultStatus } from "../../../core/types/result.code";
import type { Result } from "../../../core/types/result.type";
import { usersService } from "../../users/application/users.service";
import { usersRepository } from "../../users/repositories/users.repository";
import type { UserInput } from "../../users/types/users.input.type";
import type { RegistrationConfirmationCode } from "../types/confirmation.input.type";
import type { RegistrationEmailResending } from "../types/registration-resending.input.type";

export const registrationService = {
  async registration(dto: UserInput): Promise<Result<true>> {
    const { login, email } = dto;
    console.log(dto);

    const isUserExistByLogin = await usersRepository.isExistByLogin(login);

    if (isUserExistByLogin) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "login", message: "Already Registered" }],
      };
    }
    const isUserExistByEmail = await usersRepository.isExistByEmail(email);

    if (isUserExistByEmail) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "email", message: "Already Registered" }],
      };
    }
    console.log("user not exist");

    const result = await usersService.create(dto);
    console.log("user created", result.data?.insertedId);

    if (!result.data) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: "InternalServerError",
        data: null,
        extensions: [],
      };
    }

    const createdEntity = await usersRepository.findOneById(
      result.data.insertedId,
    );

    if (!createdEntity) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: "InternalServerError",
        data: null,
        extensions: [],
      };
    }

    console.log("userInfo", createdEntity);

    if (!createdEntity.isEmailConfirmed) {
      console.log("почта отправлена", createdEntity.isEmailConfirmed);
      emailAdapter
        .sendEmail(
          email,
          `<h1>Thank for your registration</h1>
         <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${createdEntity.confirmationCode}'>complete registration</a>
         </p>
         `,
        )
        .catch((e) => {
          console.error(e);
        });
    }
    console.log("confirmationCode", createdEntity.confirmationCode);
    console.log(
      "confirmationCodeExpirationDate",
      createdEntity.confirmationCodeExpirationDate,
    );

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  },

  async confirmEmail(dto: RegistrationConfirmationCode): Promise<Result<true>> {
    const user = await usersRepository.findOneByConfirmationCode(dto.code);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "code", message: "Code not found" }],
      };
    }

    if (user.isEmailConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "User already confirmed",
        data: null,
        extensions: [],
      };
    }

    if (dayjs().isAfter(user.confirmationCodeExpirationDate)) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Time is expired",
        data: null,
        extensions: [],
      };
    }

    const updatedResult = await usersRepository.updateUserConfirmationData(
      user._id,
    );

    if (!updatedResult) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "code", message: "Code not updated" }],
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  },

  async emailResending(dto: RegistrationEmailResending): Promise<Result<true>> {
    const { email } = dto;
    console.log(dto);

    const user = await usersRepository.isExistByEmail(email);

    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "email", message: "email does not exist" }],
      };
    }

    if (user.isEmailConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        errorMessage: "Bad Request",
        data: null,
        extensions: [{ field: "email", message: "email already confirmed" }],
      };
    }

    const newConfirmationCode = randomUUID().toString();
    const confirmationCodeExpirationDate = dayjs().add(1, "hour").toISOString();

    console.log("почта отправлена", user.isEmailConfirmed);
    emailAdapter
      .sendEmail(
        email,
        `<h1>Thank for your registration</h1>
         <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${newConfirmationCode}'>complete registration</a>
         </p>
         `,
      )
      .catch((e) => {
        console.error(e);
      });

    const updateResult = await usersRepository.updateUserConfirmationCode(
      user._id,
      newConfirmationCode,
      confirmationCodeExpirationDate,
    );

    if (!updateResult) {
      return {
        status: ResultStatus.InternalServerError,
        errorMessage: "InternalServerError",
        data: null,
        extensions: [],
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: true,
    };
  },
};
