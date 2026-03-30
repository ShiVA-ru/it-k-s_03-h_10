export type UserDb = {
  login: string;
  email: string;
  password: string;
  createdAt: string;
  confirmationCode: string | null;
  confirmationCodeExpirationDate: string | null;
  isEmailConfirmed: boolean;
};
