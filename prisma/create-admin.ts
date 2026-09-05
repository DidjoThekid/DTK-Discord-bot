import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "didjothekid@gmail.com";
  const password = "admin023";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      isAdmin: true,
      isVerified: true,
    },
    create: {
      email,
      passwordHash,
      isAdmin: true,
      isVerified: true,
    },
  });

  console.log("Compte admin créé :", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });