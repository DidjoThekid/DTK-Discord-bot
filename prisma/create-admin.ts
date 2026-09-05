import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "didjothekid@gmail.com";
  const password = "admin023";

  const passwordHash = await bcrypt.hash(password, 10);

<<<<<<< HEAD
  const admin = await prisma.user.upsert({
=======
  const user = await prisma.user.upsert({
>>>>>>> 7824227 (Fix login admin)
    where: {
      email: email,
    },
    update: {
      isAdmin: true,
      isVerified: true,
    },
    create: {
      email: email,
      passwordHash: passwordHash,
      isAdmin: true,
      isVerified: true,
    },
  });

<<<<<<< HEAD
  console.log("Compte admin créé :", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
=======
  console.log("✅ Admin créé :", user.email);
}

main()
  .catch((error) => {
    console.error(error);
>>>>>>> 7824227 (Fix login admin)
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
