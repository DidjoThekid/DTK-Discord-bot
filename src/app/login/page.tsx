"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      setLoading(false);

      if (data.isAdmin === true) {
  router.push("/dashboard");
  return;
}

router.push(
  `/verify?userId=${data.userId}&type=login&email=${encodeURIComponent(data.email)}`
);
        if (data.needsSignupVerification) {
          router.push(
            `/verify?userId=${data.userId}&type=signup&email=${encodeURIComponent(email)}`
          );
          return;
        }

        setError(data.error || "Erreur de connexion.");
        return;
      }

      // Connexion directe pour l'administrateur
      if (data.isAdmin === true) {
        router.push("/dashboard");
        return;
      }

      // Utilisateur normal avec code email
      router.push(
        `/verify?userId=${data.userId}&type=login&email=${encodeURIComponent(
          data.email
        )}`
      );

    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Erreur serveur.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">
          Se connecter
        </h1>

        <div>
          <label className="block text-sm mb-1 text-gray-400">
            E-mail
          </label>

          <input
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      setLoading(false);

      if (!res.ok) {
        if (data.needsSignupVerification) {
          router.push(
            `/verify?userId=${data.userId}&type=signup&email=${encodeURIComponent(email)}`
          );
          return;
        }

        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      // Connexion admin directe
      if (data.isAdmin === true) {
        console.log("ADMIN REDIRECT");
        router.push("/dashboard");
        return;
      }

      // Connexion normale avec code email
      router.push(
        `/verify?userId=${data.userId}&type=login&email=${encodeURIComponent(
          data.email
        )}`
      );

    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Erreur de connexion au serveur.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">
          Se connecter
        </h1>

        <div>
          <label className="block text-sm mb-1 text-gray-400">
            E-mail
          </label>

          <input
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>


        <div>
          <label className="block text-sm mb-1 text-gray-400">
            Mot de passe
          </label>

          <input
            type="password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>


        {error && (
          <p className="text-red-400 text-sm">
            {error}
          </p>
        )}


        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Connexion..." : "Continuer"}
        </button>


        <p className="text-sm text-gray-400 text-center">
          Pas encore de compte ?{" "}

          <Link
            href="/signup"
            className="text-discord hover:underline"
          >
            S'inscrire
          </Link>
        </p>

      </form>
    </main>
  );
}

