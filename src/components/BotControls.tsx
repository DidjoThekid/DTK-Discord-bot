"use client";

import { useState } from "react";

export default function BotControls({
  botId,
  initialStatus,
  hasControlUrl,
}: {
  botId: string;
  initialStatus: string;
  hasControlUrl: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState<"start" | "stop" | null>(null);
  const [error, setError] = useState("");

  async function trigger(action: "start" | "stop") {
    setLoading(action);
    setError("");
    const res = await fetch(`/api/bots/${botId}/${action}`, { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      return;
    }
    setStatus(data.status);
  }

  if (!hasControlUrl) {
    return (
      <p className="text-sm text-gray-500">
        Aucune API de contrôle n'est configurée pour ce bot — demandez à un administrateur de l'ajouter.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => trigger("start")}
          disabled={loading !== null || status === "online"}
          className="btn-primary"
        >
          {loading === "start" ? "Démarrage..." : "Démarrer"}
        </button>
        <button
          onClick={() => trigger("stop")}
          disabled={loading !== null || status === "offline"}
          className="btn-danger"
        >
          {loading === "stop" ? "Arrêt..." : "Arrêter"}
        </button>
        <span className="text-sm text-gray-400">Statut : {status}</span>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
