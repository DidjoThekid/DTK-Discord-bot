import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createVerificationCode } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "E-mail invalide ou mot de passe trop court (8 caractères minimum)." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing?.isVerified) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet e-mail." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = existing
    ? await prisma.user.update({ where: { id: existing.id }, data: { passwordHash } })
    : await prisma.user.create({ data: { email, passwordHash } });

  const code = await createVerificationCode(user.id, "signup");
  await sendVerificationEmail(email, code);

  return NextResponse.json({ userId: user.id, email: user.email });
}
