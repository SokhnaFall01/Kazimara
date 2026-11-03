"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bouton, Carte, Champ, Erreur } from "@/components/ui";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/erreurs";
import { useSession } from "@/lib/session";

export default function FicheCommerce() {
  const router = useRouter();
  const { session, rafraichir } = useSession();
  const premiere = !session.commerce;
  const c = session.commerce;
  const [f, setF] = useState({
    nom: c?.nom ?? "", raisonSociale: c?.raisonSociale ?? "", ninea: c?.ninea ?? "",
    rccm: c?.rccm ?? "", adresse: c?.adresse ?? "", assujettiTva: c?.assujettiTva ?? true,
  });
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);
  const maj = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    setErreur(""); setOk(false);
    try {
      await api.enregistrerCommerce({ ...f, langue: "fr" });
      await rafraichir();
      if (premiere) router.replace("/tableau-de-bord"); else setOk(true);
    } catch (err) { setErreur(messageErreur(err)); }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">{premiere ? "Bienvenue ! Présentez votre commerce" : "Mon commerce"}</h1>
      <p className="mt-1 text-sm text-texte-2">Ces informations apparaissent sur vos factures. Le NINEA et le RCCM peuvent être ajoutés plus tard.</p>
      <Carte className="mt-6">
        <form onSubmit={enregistrer} className="flex flex-col gap-4">
          <Champ label="Nom du commerce" value={f.nom} onChange={maj("nom")} required placeholder="Boutique Fatou" />
          <Champ label="Raison sociale (facultatif)" value={f.raisonSociale} onChange={maj("raisonSociale")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="NINEA (facultatif)" value={f.ninea} onChange={maj("ninea")} />
            <Champ label="RCCM (facultatif)" value={f.rccm} onChange={maj("rccm")} />
          </div>
          <Champ label="Adresse" value={f.adresse} onChange={maj("adresse")} placeholder="Marché Sandaga, Dakar" />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={f.assujettiTva} onChange={maj("assujettiTva")} className="h-4 w-4 accent-[var(--kz-primaire)]" />
            Mon commerce est assujetti à la TVA (18 %)
          </label>
          <p className="text-xs text-texte-2">Téléphone : {session.telephone}</p>
          <Erreur>{erreur}</Erreur>
          {ok && <p className="text-sm text-primaire">Enregistré.</p>}
          <Bouton type="submit">{premiere ? "Créer mon commerce" : "Enregistrer"}</Bouton>
        </form>
      </Carte>
    </div>
  );
}
