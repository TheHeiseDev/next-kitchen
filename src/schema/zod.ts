import { object, string, number } from "zod";
import { z } from "zod";

export const signInSchema = object({
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
});

export const passwordResetRequestSchema = object({
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email")
});

export const passwordResetConfirmSchema = object({
  email: string({ error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  code: string({ error: "Code is required" })
    .regex(/^\d{6}$/, "Код должен состоять из 6 цифр"),
  newPassword: string({ error: "Password is required" })
    .min(6, "Пароль должен быть не менее 6 символов")
    .max(32, "Пароль должен быть не более 32 символов"),
  confirmPassword: string({ error: "Confirm password is required" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});

export const ingredientSchema = object({
  name: string().min(1, "Название обязательно"),
  category: z.enum([
    "VEGETABLES",
    "FRUITS",
    "MEAT",
    "DAIRY",
    "SPICES",
    "OTHER"
  ]),
  unit: z.enum(["GRAMS", "KILOGRAMS", "LITERS", "MILLILITERS", "PIECES"]),
  pricePerUnit: number({ error: "Цена должна быть числом" })
    .min(0, "Цена должна быть положительной")
    .nullable(),
  description: z.string().optional()
});