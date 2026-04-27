"use server"

import { IFormData } from "@/types/form-data"
import { saltAndHashPassword } from "@/utils/password";
import prisma from "@/utils/prisma"

const errors = {
  passwordMismatch: 'Пароли не совпадают',
  passwordTooShort: 'Пароль должен быть не менее 6 символов',
  registration: 'Ошибка при регистрации',
  userExisting: "Пользователь с таким email уже существует"
}

export const registerUser = async (params: IFormData) => {
  const { confirmPassword, password, email, firstName, lastName } = params;

  if(confirmPassword !== password) {
    return { error: errors.passwordMismatch }
  }

  if(password.length < 6) {
    return { error: errors.passwordTooShort };
  }

  if (!firstName.trim() || !lastName.trim()) {
    throw new Error("Имя и фамилия обязательны");
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {email}
    })


    if(existingUser) {
      throw new Error(errors.userExisting)
    }

    const passwordHash = await saltAndHashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim()
      }
    }) 

    return user;
  } catch (error) {
    throw error
  }
}