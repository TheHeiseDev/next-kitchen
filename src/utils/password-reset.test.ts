import test from "node:test";
import assert from "node:assert/strict";
import {
  PASSWORD_RESET_TTL_MINUTES,
  comparePasswordResetCode,
  generatePasswordResetCode,
  getPasswordResetExpiresAt,
  getPasswordResetIdentifier,
  hashPasswordResetCode,
  isWithinCooldown
} from "@/utils/password-reset";
import { passwordResetConfirmSchema, passwordResetRequestSchema } from "@/schema/zod";

test("генерирует 6-значный код", () => {
  const code = generatePasswordResetCode();
  assert.match(code, /^\d{6}$/);
});

test("создает корректный identifier", () => {
  const identifier = getPasswordResetIdentifier("USER@MAIL.COM");
  assert.equal(identifier, "password-reset:user@mail.com");
});

test("код можно проверить через hash", async () => {
  const code = "123456";
  const hash = await hashPasswordResetCode(code);
  const valid = await comparePasswordResetCode(code, hash);
  const invalid = await comparePasswordResetCode("654321", hash);

  assert.equal(valid, true);
  assert.equal(invalid, false);
});

test("срок действия токена около 10 минут", () => {
  const expiresAt = getPasswordResetExpiresAt().getTime();
  const deltaMs = expiresAt - Date.now();
  const expectedMs = PASSWORD_RESET_TTL_MINUTES * 60 * 1000;

  assert.ok(deltaMs <= expectedMs);
  assert.ok(deltaMs >= expectedMs - 1500);
});

test("cooldown активен для свежего токена", () => {
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000);
  assert.equal(isWithinCooldown(expiresAt), true);
});

test("cooldown не активен для старого токена", () => {
  const expiresAt = new Date(Date.now() + 30 * 1000);
  assert.equal(isWithinCooldown(expiresAt), false);
});

test("валидация запроса reset email", async () => {
  const result = await passwordResetRequestSchema.parseAsync({ email: "test@mail.com" });
  assert.equal(result.email, "test@mail.com");
});

test("валидация подтверждения reset пароля", async () => {
  const result = await passwordResetConfirmSchema.parseAsync({
    email: "test@mail.com",
    code: "123456",
    newPassword: "123456",
    confirmPassword: "123456"
  });

  assert.equal(result.code, "123456");
});
