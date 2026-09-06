"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamPage() {
  const [admins, setAdmins] = useState<{ email: string }[] | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => setAdmins(data.admins ?? []))
      .catch(() => setAdmins([]));
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-gray-400 hover:text-white">
        ← Accueil
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-1">L'équipe</h1>
      <p className="text-gray-400 text-sm mb-6">
        Une question à poser directement à un admin ? Voici comment les contacter.
      </p>

      <div className="card divide-y divide-[#262b36]">
        {admins === null && <p className="p-4 text-gray-500">Chargement...</p>}

        {admins?.length === 0 && <p className="p-4 text-gray-500">Aucun admin pour le moment.</p>}

        {admins?.map((admin) => (
          <div key={admin.email} className="p-4 flex items-center justify-between">
            <span className="font-medium">Admin</span>
            <a href={`mailto:${admin.email}`} className="text-discord hover:underline text-sm">
              {admin.email}
            </a>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-6">
        Pour un support général, préfère plutôt le{" "}
        <Link href="/support" className="text-discord hover:underline">
          formulaire de contact
        </Link>
        .
      </p>
    </main>
  );
}
