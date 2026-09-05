import bcrypt from "bcryptjs";
import { prisma } from "./db";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createVerificationCode(userId: string, type: "signup" | "login") {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.verificationCode.create({
    data: { userId, type, code, expiresAt },
  });

  return code;
}

export async function checkVerificationCode(userId: string, type: "signup" | "login", code: string) {
  const record = await prisma.verificationCode.findFirst({
    where: { userId, type, code, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return false;

  await prisma.verificationCode.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return true;
}
