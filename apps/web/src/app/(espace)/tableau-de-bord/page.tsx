"use client";

import { formaterFcfa } from "@kazimara/domain";
import { useEffect, useState } from "react";
import { Carte, LienBouton } from "@/components/ui";
import { api, type TableauDeBord } from "@/lib/api";

export default function Accueil() {
  const [tb, setTb] = useState<TableauDeBord>();
  useEffect(() => { void api.tableauDeBord().then(setTb); }, []);
  if (!tb) return null;

  const tuiles = [
    { label: "Ventes du jour", valeur: tb.ventesDuJour },
    { label: "Ventes du mois", valeur: tb.ventesDuMois },
    { label: "Encaissé ce mois", valeur: tb.encaisseDuMois },
    { label: "Reste à encaisser", valeur: tb.resteAEncaisser, accent: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Accueil</h1>
        <LienBouton href="/ventes/nouvelle">+ Nouvelle vente</LienBouton>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tuiles.map((t) => (
          <Carte key={t.label} className="p-4">
            <p className="text-xs text-texte-2">{t.label}</p>
            <p className={`mt-1 text-xl font-bold tabular-nums ${t.accent && t.valeur > 0 ? "text-accent" : ""}`}>{formaterFcfa(t.valeur)}</p>
          </Carte>
        ))}
      </div>
      <Carte>
        <h2 className="font-semibold">Stock bas</h2>
        {tb.stockBas.length === 0 ? (
          <p className="mt-2 text-sm text-texte-2">Aucun produit sous son seuil d'alerte.</p>
        ) : (
          <ul className="mt-3 divide-y divide-bordure">
            {tb.stockBas.map((p) => (
              <li key={p.id} className="flex justify-between py-2 text-sm">
                <span>{p.nom}</span>
                <span className={`tabular-nums ${p.stockActuel < 0 ? "font-semibold text-accent" : "text-texte-2"}`}>
                  {p.stockActuel} {p.unite} · seuil {p.seuilAlerte}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Carte>
    </div>
  );
}
