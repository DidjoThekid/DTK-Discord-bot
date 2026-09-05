"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormState = {
  name: string;
  description: string;
  discordClientId: string;
  permissions: string;
  controlUrl: string;
  controlApiKey: string;
  isPrivate: boolean;
};

export default function EditBotPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [hasControlApiKey, setHasControlApiKey] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/bots/${params.id}`)
      .then(async (res) => {
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setForm({
          name: data.bot.name,
          description: data.bot.description ?? "",
          discordClientId: data.bot.discordClientId,
          permissions: data.bot.permissions,
          controlUrl: data.bot.controlUrl ?? "",
          controlApiKey: "",
          isPrivate: data.bot.isPrivate,
        });
        setHasControlApiKey(data.hasControlApiKey);
      })
      .catch(() => setNotFound(true));
  }, [params.id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");
    setLoading(true);

    const res = await fetch(`/api/bots/${params.id}`, {
      method: "PATCH",
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

  if (notFound) {
    return (
      <main className="max-w-lg mx-auto px-4 py-10">
        <p className="text-gray-400">Bot introuvable.</p>
        <Link href="/admin" className="text-discord hover:underline">
          ← Retour
        </Link>
      </main>
    );
  }

  if (!form) {
    return (
      <main className="max-w-lg mx-auto px-4 py-10">
        <p className="text-gray-400">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-white">
        ← Retour
      </Link>

      <form onSubmit={handleSubmit} className="card p-6 mt-4 space-y-4">
        <h1 className="text-2xl font-bold">Modifier le bot</h1>

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

        <Field label="URL de l'API de contrôle (là où tourne le bot)">
          <input
            className="input"
            placeholder="https://mon-bot.exemple.com"
            value={form.controlUrl}
            onChange={(e) => update("controlUrl", e.target.value)}
          />
        </Field>

        <Field
          label={
            hasControlApiKey
              ? "Clé secrète de l'API de contrôle (déjà définie — laissez vide pour la conserver)"
              : "Clé secrète de l'API de contrôle"
          }
        >
          <input
            className="input"
            type="password"
            placeholder={hasControlApiKey ? "••••••••" : ""}
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
          {loading ? "Enregistrement..." : "Enregistrer"}
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
