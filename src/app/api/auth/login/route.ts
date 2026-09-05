import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createVerificationCode } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  const genericError = {
    error: "E-mail ou mot de passe incorrect.",
  };

  if (!user) {
    return NextResponse.json(genericError, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    return NextResponse.json(genericError, { status: 401 });
  }

  // Pas de vérification par email pour l'admin
  if (user.isAdmin) {
  return NextResponse.json({
    userId: user.id,
    email: user.email,
    isAdmin: true,
    skipVerification: true,
  });
}

const code = await createVerificationCode(user.id, "login");
await sendVerificationEmail(email, code);

return NextResponse.json({
  userId: user.id,
  email: user.email,
});
