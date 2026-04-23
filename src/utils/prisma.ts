import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";



// Prevent creating a new PrismaClient on every Next.js hot-reload.
// In dev we reuse the same instance via `global`.
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(databaseUrl),
  });

// In development, keep the prisma instance cached on `global`.
// In production, creating one instance per process is fine.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}