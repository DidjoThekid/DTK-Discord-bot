"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const type = (params.get("type") as "signup" | "login") ?? "signup";
  const email = params.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code, type }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erreur de connexion au serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold">Vérification</h1>
        <p className="text-sm text-gray-400">
          Un code à 6 chiffres a été envoyé à <span className="text-white">{email}</span>.
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          className="input text-center text-2xl tracking-[0.5em]"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full">
          {loading ? "Vérification..." : "Valider"}
        </button>
      </form>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}
