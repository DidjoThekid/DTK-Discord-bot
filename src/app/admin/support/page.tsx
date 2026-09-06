import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import type { SupportMessage } from "@prisma/client";
import SupportInboxList from "@/components/SupportInboxList";

export default async function AdminSupportPage() {
  const session = await getSession();
  if (!session?.isAdmin) redirect("/dashboard");

  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Boîte de réception support</h1>
        <Link href="/admin" className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430]">
          Retour admin
        </Link>
      </div>

      <SupportInboxList
        initialMessages={messages.map((m: SupportMessage) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
