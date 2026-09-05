import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import type { Bot } from "@prisma/client";
import DeleteBotButton from "@/components/DeleteBotButton";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.isAdmin) redirect("/dashboard");

  const bots = await prisma.bot.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Administration des bots</h1>
        <div className="flex gap-3">
          <Link href="/dashboard" className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430]">
            Retour au dashboard
          </Link>
          <Link href="/admin/bots/new" className="btn-primary">
            + Nouveau bot
          </Link>
        </div>
      </div>

      <div className="grid gap-3">
        {bots.map((bot: Bot) => (
          <div key={bot.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{bot.name}</span>
                {bot.isPrivate && (
                  <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded">
                    privé
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{bot.description}</p>
              <p className="text-xs text-gray-600 mt-1">
                Client ID : {bot.discordClientId} · Contrôle :{" "}
                {bot.controlUrl ? bot.controlUrl : "non configurée"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/bots/${bot.id}/edit`}
                className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430]"
              >
                Modifier
              </Link>
              <DeleteBotButton botId={bot.id} />
            </div>
          </div>
        ))}

        {bots.length === 0 && (
          <p className="text-gray-500 text-center py-10">Aucun bot enregistré.</p>
        )}
      </div>
    </main>
  );
}
