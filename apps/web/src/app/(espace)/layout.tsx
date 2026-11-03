"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Symbole } from "@/components/Logo";
import { api } from "@/lib/api";
import { FournisseurSession, useSession } from "@/lib/session";

const liens = [
  { href: "/tableau-de-bord", label: "Accueil" },
  { href: "/ventes", label: "Ventes" },
  { href: "/produits", label: "Produits" },
  { href: "/commerce", label: "Mon commerce" },
];

function Barre() {
  const chemin = usePathname();
  const router = useRouter();
  const { session } = useSession();
  return (
    <header className="sticky top-0 z-10 border-b border-bordure bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        <Link href="/tableau-de-bord" className="flex items-center gap-2">
          <Symbole className="h-8 w-8" />
          <span className="hidden font-bold sm:inline">{session.commerce?.nom ?? "Kazimara"}</span>
        </Link>
        {session.commerce && (
          <nav className="flex flex-1 gap-1 overflow-x-auto text-sm">
            {liens.map((l) => (
              <Link key={l.href} href={l.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 ${chemin.startsWith(l.href) ? "bg-primaire/10 font-semibold text-primaire" : "text-texte-2 hover:text-texte"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
        <button className="ml-auto text-sm text-texte-2 hover:text-texte"
          onClick={async () => { await api.deconnexion(); router.replace("/connexion"); }}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}

export default function EspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <FournisseurSession>
      <Barre />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </FournisseurSession>
  );
}
