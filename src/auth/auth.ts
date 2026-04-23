import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs";
import { ZodError } from "zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { signInSchema } from "@/schema/zod"
import prisma from "@/utils/prisma"
import { getUserFromDb } from "@/utils/user"

class InvalidCredentialsError extends CredentialsSignin {
  code = "invalid_credentials"
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new InvalidCredentialsError();
          }

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await getUserFromDb(email);

          if (!user || !user.password) {
            throw new InvalidCredentialsError();
          }

          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password
          );

          if (!isPasswordValid) {
            throw new InvalidCredentialsError();
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          if (error instanceof ZodError) {
            throw new InvalidCredentialsError();
          }
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
});