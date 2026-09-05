import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const bots = await prisma.bot.findMany({
    where: session.isAdmin ? {} : { isPrivate: false },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      discordClientId: true,
      permissions: true,
      isPrivate: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ bots });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { name, description, discordClientId, permissions, controlUrl, controlApiKey, isPrivate } =
    await req.json();

  if (!name || !discordClientId) {
    return NextResponse.json({ error: "Nom et Client ID Discord requis." }, { status: 400 });
  }

  const bot = await prisma.bot.create({
    data: {
      name,
      description,
      discordClientId,
      permissions: permissions || "8",
      controlUrl,
      controlApiKey,
      isPrivate: !!isPrivate,
    },
  });

  return NextResponse.json({ bot });
}
