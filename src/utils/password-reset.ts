import bcrypt from "bcryptjs";

export const PASSWORD_RESET_TTL_MINUTES = 10;
export const PASSWORD_RESET_COOLDOWN_SECONDS = 60;
export const PASSWORD_RESET_MAX_ATTEMPTS = 5;
export const PASSWORD_RESET_ATTEMPT_WINDOW_MINUTES = 15;

export const getPasswordResetIdentifier = (email: string) =>
  `password-reset:${email.toLowerCase()}`;

export const generatePasswordResetCode = (): string =>
  Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");

export const getPasswordResetExpiresAt = () =>
  new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000);

export const hashPasswordResetCode = async (code: string) => bcrypt.hash(code, 10);

export const comparePasswordResetCode = async (code: string, hash: string) =>
  bcrypt.compare(code, hash);

export const isWithinCooldown = (expiresAt: Date) => {
  const cooldownBorder = Date.now() + (PASSWORD_RESET_TTL_MINUTES * 60 - PASSWORD_RESET_COOLDOWN_SECONDS) * 1000;
  return expiresAt.getTime() > cooldownBorder;
};
