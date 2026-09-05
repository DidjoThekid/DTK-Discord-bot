import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { buildBotInviteUrl } from "@/lib/discord";
import BotControls from "@/components/BotControls";

export default async function BotDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const [bot, user] = await Promise.all([
    prisma.bot.findUnique({ where: { id: params.id } }),
    prisma.user.findUnique({ where: { id: session.userId } }),
  ]);

  if (!bot || (bot.isPrivate && !session.isAdmin)) notFound();

  const guilds = (user?.discordGuilds as Array<{ id: string; name: string }> | null) ?? [];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
        ← Retour
      </Link>

      <div className="card p-6 mt-4">
        <h1 className="text-2xl font-bold mb-1">{bot.name}</h1>
        <p className="text-gray-400 mb-6">{bot.description ?? "Aucune description."}</p>

        <BotControls botId={bot.id} initialStatus={bot.status} hasControlUrl={!!bot.controlUrl} />

        <hr className="border-[#262b36] my-6" />

        <h2 className="font-semibold mb-3">Ajouter ce bot à un serveur</h2>

        {guilds.length === 0 ? (
          <p className="text-sm text-gray-400">
            Liez votre compte Discord depuis le tableau de bord pour choisir un serveur, ou{" "}
            
              href={buildBotInviteUrl(bot.discordClientId, bot.permissions)}
              target="_blank"
              className="text-discord hover:underline"
            >
              ouvrez le lien d'invitation générique
            </a>
            .
          </p>
        ) : (
          <div className="grid gap-2">
            {guilds.map((g) => (
              
                key={g.id}
                href={buildBotInviteUrl(bot.discordClientId, bot.permissions, g.id)}
                target="_blank"
                className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430] text-left"
              >
                Ajouter à « {g.name} »
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
