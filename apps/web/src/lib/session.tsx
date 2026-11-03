"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { api, type Session } from "./api";

const Contexte = createContext<{ session: Session; rafraichir: () => Promise<void> } | null>(null);

/** Protège l'espace connecté : sans session → /connexion ; sans fiche commerce → /commerce. */
export function FournisseurSession({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const chemin = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  async function rafraichir() {
    setSession(await api.session());
  }

  useEffect(() => { void rafraichir(); }, []);

  useEffect(() => {
    if (session === null) router.replace("/connexion");
    else if (session && !session.commerce && chemin !== "/commerce") router.replace("/commerce");
  }, [session, chemin, router]);

  if (!session || (!session.commerce && chemin !== "/commerce")) {
    return <div className="flex min-h-dvh items-center justify-center text-sm text-texte-2">Chargement…</div>;
  }
  return <Contexte.Provider value={{ session, rafraichir }}>{children}</Contexte.Provider>;
}

export function useSession() {
  const c = useContext(Contexte);
  if (!c) throw new Error("useSession hors de FournisseurSession");
  return c;
}
