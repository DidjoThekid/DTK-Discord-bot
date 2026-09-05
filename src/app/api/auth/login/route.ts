import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createVerificationCode } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  const genericError = { error: "E-mail ou mot de passe incorrect." };

  if (!user) return NextResponse.json(genericError, { status: 401 });

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return NextResponse.json(genericError, { status: 401 });

  if (!user.isVerified) {
    return NextResponse.json(
      { error: "Compte non vérifié. Terminez d'abord l'inscription.", userId: user.id, needsSignupVerification: true },
      { status: 403 }
    );
  }

  // Les comptes admin se connectent directement, sans code de vérification par e-mail
  if (user.isAdmin) {
    await createSession({ userId: user.id, email: user.email, isAdmin: true });
    return NextResponse.json({ ok: true, isAdmin: true });
  }

  const code = await createVerificationCode(user.id, "login");

  try {
    await sendVerificationEmail(email, code);
  } catch (err) {
    console.error("Échec de l'envoi de l'e-mail de vérification :", err);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'e-mail de vérification. Vérifiez la configuration Resend (RESEND_API_KEY, domaine autorisé)." },
      { status: 502 }
    );
  }

  return NextResponse.json({ userId: user.id, email: user.email });
}
