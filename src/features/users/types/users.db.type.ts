// export type UserDb = {
//   login: string;
//   email: string;
//   password: string;
//   createdAt: string;
//   confirmationCode: string | null;
//   confirmationCodeExpirationDate: string | null;
//   isEmailConfirmed: boolean;
// };
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class UserDb {
  public createdAt: string;
  public confirmationCode: string | null;
  public confirmationCodeExpirationDate: string | null;

  constructor(
    public login: string,
    public email: string,
    public password: string,
    public isEmailConfirmed: boolean,
  ) {
    this.createdAt = new Date().toISOString();
    this.confirmationCode = this.isEmailConfirmed ? null : randomUUID();
    this.confirmationCodeExpirationDate = isEmailConfirmed
      ? null
      : dayjs().add(1, "hour").toISOString();
  }
}
