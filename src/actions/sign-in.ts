"use server";

import { signIn } from "@/auth/auth";
import { AuthError } from "next-auth";

export async function signInWithCredentials(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    return;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw new Error("Неверный email или пароль");
        default:
          throw  new Error("Что-то пошло не так");
      }
    }
  }
}