import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

// N'importe qui peut envoyer un message, pas besoin d'être connecté
export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Nom, e-mail et message sont requis." }, { status: 400 });
  }

  await prisma.supportMessage.create({
    data: { name, email, subject: subject || null, message },
  });

  return NextResponse.json({ ok: true });
}

// Seuls les admins peuvent lire les messages reçus
export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ messages });
}
