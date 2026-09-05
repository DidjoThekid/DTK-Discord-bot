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
            <Link href="/admin" className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430]">
              Admin
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      {!user?.discordId && (
        <div className="card p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-300">
            Liez votre compte Discord pour ajouter les bots directement sur vos serveurs.
          </p>
          <LinkDiscordButton />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {bots.map((bot: Bot) => (
          <Link
            key={bot.id}
            href={`/dashboard/bots/${bot.id}`}
            className="card p-5 hover:border-discord transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">{bot.name}</h2>
              {bot.isPrivate && (
                <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded">privé</span>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-3">{bot.description ?? "Aucune description."}</p>
            <StatusDot status={bot.status} />
          </Link>
        ))}

        {bots.length === 0 && (
          <p className="text-gray-500 col-span-2 text-center py-10">Aucun bot pour le moment.</p>
        )}
      </div>
    </main>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "online" ? "bg-green-500" : status === "offline" ? "bg-red-500" : "bg-gray-500";
  const label = status === "online" ? "En ligne" : status === "offline" ? "Hors ligne" : "Inconnu";
  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </div>
  );
}
