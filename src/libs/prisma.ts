//SQLITE CONFIG
// import { PrismaClient } from "@prisma/client";

// const gloabalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma = gloabalForPrisma.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") gloabalForPrisma.prisma = prisma;

/// TURSO CONFIG
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
