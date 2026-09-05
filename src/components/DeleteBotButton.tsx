"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteBotButton({ botId }: { botId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer ce bot ?")) return;
    setLoading(true);
    await fetch(`/api/bots/${botId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="btn-danger">
      {loading ? "..." : "Supprimer"}
    </button>
  );
}
