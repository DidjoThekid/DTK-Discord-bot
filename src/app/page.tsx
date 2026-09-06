import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <Image 
        src="/bot-avatar.png" 
        alt="My Bot - Team DTK" 
        width={150} 
        height={150}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">My Bot - Team DTK</h1>
      <p className="text-gray-400 max-w-md mb-8">
        Connectez, surveillez et pilotez tous vos bots Discord depuis un seul tableau de bord.
      </p>
      <div className="flex gap-4">
        <Link href="/signup" className="btn-primary">
          Créer un compte
        </Link>
        <Link href="/login" className="btn bg-panel border border-[#262b36] hover:bg-[#1f2430]">
          Se connecter
        </Link>
      </div>
    </main>
  );
}
