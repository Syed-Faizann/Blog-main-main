import { PrismaClient } from "../prisma/generated-client/index.js";

const globalForPrisma = globalThis;

// Invalidate stale in-memory PrismaClient that lacks the new category field
if (
  globalForPrisma.prisma &&
  (!globalForPrisma.prisma.post?.fields ||
    !("category" in globalForPrisma.prisma.post.fields))
) {
  try {
    globalForPrisma.prisma.$disconnect();
  } catch (e) {}
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
