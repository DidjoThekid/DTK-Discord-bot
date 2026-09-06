"use client";

import { useState } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      setSent(true);
    } catch {
      setError("Erreur de connexion au serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card w-full max-w-lg p-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-white">
          ← Accueil
        </Link>

        <h1 className="text-2xl font-bold mt-4 mb-1">Contacter le support</h1>
        <p className="text-gray-400 text-sm mb-6">
          Une question, un bug à signaler ? Écris-nous, un admin te répondra par e-mail.
        </p>

        {sent ? (
          <p className="text-green-400">Message envoyé ! Merci, on te répond dès que possible.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Nom</label>
              <input
                required
                className="input"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">E-mail</label>
              <input
                type="email"
                required
                className="input"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Sujet (optionnel)</label>
              <input
                className="input"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Message</label>
              <textarea
                required
                rows={5}
                className="input"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
