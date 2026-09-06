import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import type { Bot } from "@prisma/client";
import LogoutButton from "@/components/LogoutButton";
import LinkDiscordButton from "@/components/LinkDiscordButton";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [bots, user] = await Promise.all([
    prisma.bot.findMany({
      where: session.isAdmin ? {} : { isPrivate: false },
      orderBy: { createdAt: "asc" },
    }),
    prisma.user.findUnique({ where: { id: session.userId } }),
  ]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Vos bots</h1>
          <p className="text-gray-400 text-sm">{session.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {session.isAdmin && (
            <>
              <Link href="/admin/support" className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430]">
                Support
              </Link>
              <Link href="/admin" className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430]">
                Admin
              </Link>
            </>
          )}
          <LogoutButton />
        </div>
      </div>

      {!user?.discordId && (
        <div className="card p-4 mb-6 flex
