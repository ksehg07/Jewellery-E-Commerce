import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run bootstrap:admin -- <existing-user-email>");
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, status: true },
    });

    if (!user) {
      console.error("No user found for the supplied email.");
      process.exitCode = 1;
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: "ADMIN",
          status: "ACTIVE",
        },
      });

      console.log("User promoted successfully: role=ADMIN, status=ACTIVE.");
    }
  } finally {
    await prisma.$disconnect();
  }
}

void main();