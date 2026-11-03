"use client";

import { formaterFcfa } from "@kazimara/domain";
import { useEffect, useState } from "react";
import { Bouton, Carte, Champ, Erreur, Pastille } from "@/components/ui";
import { api, type Produit } from "@/lib/api";
import { messageErreur } from "@/lib/erreurs";

const vide = { nom: "", prixHt: "", tauxTva: "18", unite: "unité", stockInitial: "0", seuilAlerte: "0" };

export default function Produits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [f, setF] = useState(vide);
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState("");

  const charger = () => api.listerProduits().then(setProduits);
  useEffect(() => { void charger(); }, []);
  const maj = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function ajouter(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    try {
      await api.creerProduit({
        nom: f.nom.trim(), prixHt: Math.round(Number(f.prixHt)), tauxTva: Number(f.tauxTva) as 0 | 10 | 18,
        unite: f.unite.trim() || "unité", stockInitial: Number(f.stockInitial) || 0, seuilAlerte: Number(f.seuilAlerte) || 0, actif: true,
      });
      setF(vide); setOuvert(false); await charger();
    } catch (err) { setErreur(messageErreur(err)); }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Bouton variante={ouvert ? "secondaire" : "primaire"} onClick={() => setOuvert(!ouvert)}>{ouvert ? "Annuler" : "+ Ajouter un produit"}</Bouton>
      </div>

      {ouvert && (
        <Carte>
          <form onSubmit={ajouter} className="grid gap-4 sm:grid-cols-2">
            <Champ label="Nom" value={f.nom} onChange={maj("nom")} required className="sm:col-span-2" />
            <Champ label="Prix HT (FCFA)" inputMode="numeric" value={f.prixHt} onChange={(e) => setF({ ...f, prixHt: e.target.value.replace(/\D/g, "") })} required />
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">TVA</span>
              <select value={f.tauxTva} onChange={maj("tauxTva")} className="rounded-xl border border-bordure bg-surface px-3 py-2.5 text-base">
                <option value="18">18 %</option><option value="10">10 %</option><option value="0">Exonéré</option>
              </select>
            </label>
            <Champ label="Unité" value={f.unite} onChange={maj("unite")} />
            <Champ label="Stock initial" inputMode="decimal" value={f.stockInitial} onChange={maj("stockInitial")} />
            <Champ label="Seuil d'alerte" inputMode="decimal" value={f.seuilAlerte} onChange={maj("seuilAlerte")} />
            <div className="flex flex-col gap-3 sm:col-span-2"><Erreur>{erreur}</Erreur><Bouton type="submit">Enregistrer le produit</Bouton></div>
          </form>
        </Carte>
      )}

      <Carte className="p-0">
        <ul className="divide-y divide-bordure">
          {produits.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
              <div>
                <p className="font-medium">{p.nom}</p>
                <p className="text-xs text-texte-2">{formaterFcfa(p.prixHt)} HT · TVA {p.tauxTva} %</p>
              </div>
              <div className="flex items-center gap-2 text-sm tabular-nums">
                {p.stockActuel <= p.seuilAlerte && <Pastille ton="orange">Stock bas</Pastille>}
                <span>{p.stockActuel} {p.unite}</span>
              </div>
            </li>
          ))}
        </ul>
      </Carte>
    </div>
  );
}
