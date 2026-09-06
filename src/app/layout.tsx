import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Bot - Team DTK",
  description: "Gérez tous vos bots Discord de la Team DTK depuis un seul endroit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
