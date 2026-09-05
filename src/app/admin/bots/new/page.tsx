"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBotPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    discordClientId: "",
    permissions: "8",
    controlUrl: "",
    controlApiKey: "",
    isPrivate: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-white">
        ← Retour
      </Link>

      <form onSubmit={handleSubmit} className="card p-6 mt-4 space-y-4">
        <h1 className="text-2xl font-bold">Nouveau bot</h1>

        <Field label="Nom">
          <input className="input" required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </Field>

        <Field label="Description">
          <textarea
            className="input"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>

        <Field label="Client ID Discord (portail développeur)">
          <input
            className="input"
            required
            value={form.discordClientId}
            onChange={(e) => update("discordClientId", e.target.value)}
          />
        </Field>

        <Field label="Permissions (bitmask, 8 = Administrateur)">
          <input
            className="input"
            value={form.permissions}
            onChange={(e) => update("permissions", e.target.value)}
          />
        </Field>

        <Field label="URL de l'API de contrôle (hébergée où tourne le bot)">
          <input
            className="input"
            placeholder="https://mon-bot.exemple.com"
            value={form.controlUrl}
            onChange={(e) => update("controlUrl", e.target.value)}
          />
        </Field>

        <Field label="Clé secrète de l'API de contrôle">
          <input
            className="input"
            type="password"
            value={form.controlApiKey}
            onChange={(e) => update("controlApiKey", e.target.value)}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={form.isPrivate}
            onChange={(e) => update("isPrivate", e.target.checked)}
          />
          Bot privé (visible uniquement par les administrateurs)
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Création..." : "Créer le bot"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-gray-400">{label}</label>
      {children}
    </div>
  );
}
