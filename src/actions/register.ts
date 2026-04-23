"use server"

import { IFormData } from "@/types/form-data"
import { saltAndHashPassword } from "@/utils/password";
import { prisma } from "@/utils/prisma"

const errors = {
  passwordMismatch: 'Пароли не совпадают',
  passwordTooShort: 'Пароль должен быть не менее 6 символов',
  registration: 'Ошибка при регистрации',
  userExisting: "Пользователь с таким email уже существует"
}

export const registerUser = async (params: IFormData) => {
  const {confirmPassword, password, email} = params;

  if(confirmPassword !== password) {
    return { error: errors.passwordMismatch }
  }

  if(password.length < 6) {
    return { error: errors.passwordTooShort };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {email}
    })

    if(existingUser) {
      return { error: errors.userExisting}
    }

    const passwordHash = await saltAndHashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
      }
    }) 

    return user;
  } catch (error) {
    console.log(errors.registration, error);
    return { error: errors.registration };
  }
}