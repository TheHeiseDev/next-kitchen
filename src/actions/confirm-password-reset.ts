"use server";

import { ZodError } from "zod";
import prisma from "@/utils/prisma";
import { passwordResetConfirmSchema } from "@/schema/zod";
import {
  comparePasswordResetCode,
  getPasswordResetIdentifier
} from "@/utils/password-reset";
import { saltAndHashPassword } from "@/utils/password";
import { clearPasswordResetAttempts } from "@/utils/password-reset-rate-limit";

type ConfirmPasswordResetParams = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export const confirmPasswordReset = async (params: ConfirmPasswordResetParams) => {
  try {
    const parsed = await passwordResetConfirmSchema.parseAsync(params);
    const normalizedEmail = parsed.email.toLowerCase();
    const identifier = getPasswordResetIdentifier(normalizedEmail);

    const token = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        expires: { gt: new Date() }
      },
      orderBy: { expires: "desc" }
    });

    if (!token) {
      throw new Error("Код недействителен или истек");
    }

    const isValidCode = await comparePasswordResetCode(parsed.code, token.token);
    if (!isValidCode) {
      throw new Error("Неверный код");
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true }
    });

    if (!user) {
      throw new Error("Не удалось обновить пароль");
    }

    const passwordHash = await saltAndHashPassword(parsed.newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: passwordHash }
      }),
      prisma.verificationToken.deleteMany({ where: { identifier } }),
      prisma.session.deleteMany({ where: { userId: user.id } })
    ]);

    clearPasswordResetAttempts(normalizedEmail);

    return { message: "Пароль успешно обновлен" };
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.issues[0]?.message ?? "Проверьте корректность данных");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Не удалось сбросить пароль");
  }
};
