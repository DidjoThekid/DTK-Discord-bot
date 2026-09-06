"use client";

import { useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function SupportInboxList({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);

  async function toggleRead(id: string, read: boolean) {
    setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read } : m)));
    await fetch(`/api/support/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    setMessages((msgs) => msgs.filter((m) => m.id !== id));
    await fetch(`/api/support/${id}`, { method: "DELETE" });
  }

  if (messages.length === 0) {
    return <p className="text-gray-500 text-center py-10">Aucun message pour le moment.</p>;
  }

  return (
    <div className="grid gap-3">
      {messages.map((m) => (
        <div key={m.id} className={`card p-4 ${m.read ? "opacity-60" : ""}`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-semibold">{m.name}</span>{" "}
              <a href={`mailto:${m.email}`} className="text-discord text-sm hover:underline">
                {m.email}
              </a>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(m.createdAt).toLocaleString("fr-FR")}
            </span>
          </div>

          {m.subject && <p className="font-medium mb-1">{m.subject}</p>}
          <p className="text-sm text-gray-300 whitespace-pre-wrap mb-3">{m.message}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleRead(m.id, !m.read)}
              className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430] text-sm"
            >
              {m.read ? "Marquer non lu" : "Marquer lu"}
            </button>
            <button onClick={() => remove(m.id)} className="btn-danger text-sm">
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
