import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  const { read } = await req.json();

  const message = await prisma.supportMessage.update({
    where: { id: params.id },
    data: { read: !!read },
  });

  return NextResponse.json({ message });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });

  await prisma.supportMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
