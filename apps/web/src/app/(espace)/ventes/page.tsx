"use client";

import { formaterFcfa } from "@kazimara/domain";
import { t } from "@kazimara/i18n";
import { useEffect, useState } from "react";
import { Carte, LienBouton, Pastille } from "@/components/ui";
import { api, type Vente } from "@/lib/api";

const tonStatut = { payee: "vert", payee_en_partie: "orange", non_payee: "gris" } as const;
const date = new Intl.DateTimeFormat("fr-SN", { dateStyle: "medium", timeStyle: "short" });

export default function Ventes() {
  const [ventes, setVentes] = useState<Vente[]>();
  useEffect(() => { void api.listerVentes().then(setVentes); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Ventes</h1>
        <LienBouton href="/ventes/nouvelle">+ Nouvelle vente</LienBouton>
      </div>
      {ventes?.length === 0 && (
        <Carte className="text-center text-sm text-texte-2">Pas encore de vente. Déclarez la première !</Carte>
      )}
      {ventes && ventes.length > 0 && (
        <Carte className="p-0">
          <ul className="divide-y divide-bordure">
            {ventes.map((v) => (
              <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <div>
                  <p className="font-mono text-sm font-semibold">{v.numeroFacture}</p>
                  <p className="text-xs text-texte-2">{date.format(new Date(v.date))}{v.clientNom ? ` · ${v.clientNom}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Pastille ton={tonStatut[v.statut]}>{t("fr", `statutPaiement.${v.statut}`)}</Pastille>
                  <span className="font-semibold tabular-nums">{formaterFcfa(v.totalTtc)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Carte>
      )}
    </div>
  );
}
