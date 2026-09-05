import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const bot = await prisma.bot.findUnique({ where: { id: params.id } });
  if (!bot || (bot.isPrivate && !session.isAdmin)) {
    return NextResponse.json({ error: "Bot introuvable." }, { status: 404 });
  }

  const { controlApiKey, ...safeBot } = bot;
  return NextResponse.json({
    bot: safeBot,
    hasControlUrl: !!bot.controlUrl,
    hasControlApiKey: !!bot.controlApiKey,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const body = await req.json();
  const { name, description, discordClientId, permissions, controlUrl, controlApiKey, isPrivate } = body;

  if (!name || !discordClientId) {
    return NextResponse.json({ error: "Nom et Client ID Discord requis." }, { status: 400 });
  }

  const bot = await prisma.bot.update({
    where: { id: params.id },
    data: {
      name,
      description,
      discordClientId,
      permissions: permissions || "8",
      controlUrl: controlUrl ?? null,
      isPrivate: !!isPrivate,
      ...(controlApiKey ? { controlApiKey } : {}),
    },
  });

  const { controlApiKey: _omit, ...safeBot } = bot;
  return NextResponse.json({ bot: safeBot });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.bot.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
