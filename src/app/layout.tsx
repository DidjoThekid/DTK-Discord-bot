import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Discord Bot Manager",
  description: "Gérez tous vos bots Discord depuis un seul endroit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
