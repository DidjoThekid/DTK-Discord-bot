import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Route publique : ne renvoie que l'e-mail des comptes admin, rien de sensible
export async function GET() {
  const admins = await prisma.user.findMany({
    where: { isAdmin: true },
    select: { email: true },
    orderBy: { email: "asc" },
  });

  return NextResponse.json({ admins });
}
