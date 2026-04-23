import bcrypt from "bcryptjs"

export const saltAndHashPassword = (password: string): Promise<string> => {
    const saltRounds = 10;

     return bcrypt.hash(password, saltRounds)
}