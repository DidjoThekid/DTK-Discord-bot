import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const bot = await prisma.bot.findUnique({ where: { id: params.id } });
  if (!bot || (bot.isPrivate && !session.isAdmin)) {
    return NextResponse.json({ error: "Bot introuvable." }, { status: 404 });
  }
  if (!bot.controlUrl) {
    return NextResponse.json({ error: "Ce bot n'a pas d'API de contrôle configurée." }, { status: 400 });
  }

  try {
    const res = await fetch(`${bot.controlUrl.replace(/\/$/, "")}/start`, {
      method: "POST",
      headers: bot.controlApiKey ? { Authorization: `Bearer ${bot.controlApiKey}` } : {},
    });
    const status = res.ok ? "online" : "unknown";
    await prisma.bot.update({ where: { id: bot.id }, data: { status } });
    return NextResponse.json({ ok: res.ok, status });
  } catch {
    await prisma.bot.update({ where: { id: bot.id }, data: { status: "unknown" } });
    return NextResponse.json({ error: "Impossible de joindre l'API du bot." }, { status: 502 });
  }
}
