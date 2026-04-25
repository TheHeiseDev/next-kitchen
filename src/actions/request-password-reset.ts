"use server";

import { ZodError } from "zod";
import prisma from "@/utils/prisma";
import { passwordResetRequestSchema } from "@/schema/zod";
import { getUserFromDb } from "@/utils/user";
import { sendPasswordResetCodeEmail } from "@/utils/email";
import {
  generatePasswordResetCode,
  getPasswordResetExpiresAt,
  getPasswordResetIdentifier,
  hashPasswordResetCode,
  isWithinCooldown
} from "@/utils/password-reset";
import { registerPasswordResetAttempt } from "@/utils/password-reset-rate-limit";

const SUCCESS_MESSAGE = "Если пользователь с таким email существует, код отправлен.";

export const requestPasswordReset = async (email: string) => {
  try {
    const parsed = await passwordResetRequestSchema.parseAsync({ email });
    const normalizedEmail = parsed.email.toLowerCase();
    const { blocked } = registerPasswordResetAttempt(normalizedEmail);

    if (blocked) {
      return { message: SUCCESS_MESSAGE };
    }

    const user = await getUserFromDb(normalizedEmail);
    if (!user) {
      return { message: SUCCESS_MESSAGE };
    }

    const identifier = getPasswordResetIdentifier(normalizedEmail);
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        expires: { gt: new Date() }
      },
      orderBy: { expires: "desc" }
    });

    if (existingToken && isWithinCooldown(existingToken.expires)) {
      return { message: SUCCESS_MESSAGE };
    }

    await prisma.verificationToken.deleteMany({ where: { identifier } });

    const code = generatePasswordResetCode();
    const hashedCode = await hashPasswordResetCode(code);
    const expiresAt = getPasswordResetExpiresAt();

    await prisma.verificationToken.create({
      data: {
        identifier,
        token: hashedCode,
        expires: expiresAt
      }
    });

    await sendPasswordResetCodeEmail(normalizedEmail, code);

    return { message: SUCCESS_MESSAGE };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error("Проверьте корректность email");
    }

    if (error instanceof Error) {
      console.error("requestPasswordReset failed:", error.message);
      throw new Error(`Не удалось отправить код восстановления: ${error.message}`);
    }

    throw new Error("Не удалось отправить код восстановления");
  }
};
