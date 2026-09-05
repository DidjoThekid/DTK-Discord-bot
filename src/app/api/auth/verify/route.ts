import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkVerificationCode } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { userId, code, type } = await req.json();

  if (!userId || !code || (type !== "signup" && type !== "login")) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const ok = await checkVerificationCode(userId, type, code);
  if (!ok) {
    return NextResponse.json({ error: "Code invalide ou expiré." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });

  await createSession({ userId: user.id, email: user.email, isAdmin: user.isAdmin });

  return NextResponse.json({ ok: true });
}
