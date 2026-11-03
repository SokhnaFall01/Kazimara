"use client";

import { calculerTotaux, formaterFcfa, type TotauxVente } from "@kazimara/domain";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bouton, Carte, Champ, Erreur } from "@/components/ui";
import { api, type Client, type Produit } from "@/lib/api";
import { messageErreur } from "@/lib/erreurs";
import { useSession } from "@/lib/session";

interface Ligne { cle: string; produitId: string; quantite: string }

const nouvelleLigne = (): Ligne => ({ cle: crypto.randomUUID(), produitId: "", quantite: "1" });

export default function NouvelleVente() {
  const router = useRouter();
  const { session } = useSession();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [lignes, setLignes] = useState<Ligne[]>([nouvelleLigne()]);
  const [clientId, setClientId] = useState("");
  const [nouveauClient, setNouveauClient] = useState("");
  const [paiement, setPaiement] = useState<"total" | "partiel" | "ardoise">("total");
  const [montantPartiel, setMontantPartiel] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  useEffect(() => {
    void api.listerProduits().then((p) => setProduits(p.filter((x) => x.actif)));
    void api.listerClients().then(setClients);
  }, []);

  const lignesValides = lignes.flatMap((l) => {
    const p = produits.find((x) => x.id === l.produitId);
    const q = Number(l.quantite.replace(",", "."));
    return p && q > 0 ? [{ produitId: p.id, libelle: p.nom, quantite: q, prixUnitaireHt: p.prixHt, tauxTva: p.tauxTva }] : [];
  });

  // Aperçu calculé avec les mêmes règles que le serveur ; le serveur recalcule à l'enregistrement.
  const totaux = useMemo<TotauxVente | null>(() => {
    try { return lignesValides.length ? calculerTotaux(lignesValides, { assujettiTva: session.commerce!.assujettiTva }) : null; }
    catch { return null; }
  }, [JSON.stringify(lignesValides), session.commerce]);

  const maj = (cle: string, champ: keyof Ligne, valeur: string) =>
    setLignes((ls) => ls.map((l) => (l.cle === cle ? { ...l, [champ]: valeur } : l)));

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!totaux) return;
    setErreur("");
    let idClient = clientId || undefined;
    if ((paiement !== "total") && !idClient && !nouveauClient.trim()) {
      setErreur("Indiquez le client pour mettre une vente sur l'ardoise.");
      return;
    }
    setEnCours(true);
    try {
      if (!idClient && nouveauClient.trim()) idClient = (await api.creerClient({ nom: nouveauClient.trim() })).id;
      const especes = paiement === "total" ? totaux.totalTtc : paiement === "partiel" ? Math.round(Number(montantPartiel) || 0) : 0;
      await api.creerVente({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        clientId: idClient,
        source: "web",
        lignes: lignesValides,
        paiementEspeces: especes > 0 ? especes : undefined,
      });
      router.push("/ventes");
    } catch (err) {
      setErreur(messageErreur(err));
      setEnCours(false);
    }
  }

  const choix = "rounded-xl border border-bordure bg-surface px-3 py-2.5 text-base outline-none focus:border-primaire";

  return (
    <form onSubmit={enregistrer} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Nouvelle vente</h1>
        <Carte className="flex flex-col gap-3">
          <h2 className="font-semibold">Articles</h2>
          {lignes.map((l) => {
            const p = produits.find((x) => x.id === l.produitId);
            return (
              <div key={l.cle} className="grid grid-cols-[1fr_90px_auto] items-end gap-2">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="sr-only">Produit</span>
                  <select className={choix} value={l.produitId} onChange={(e) => maj(l.cle, "produitId", e.target.value)}>
                    <option value="">Choisir un produit…</option>
                    {produits.map((x) => <option key={x.id} value={x.id}>{x.nom} — {formaterFcfa(x.prixHt)} HT</option>)}
                  </select>
                </label>
                <Champ label={p ? `Qté (${p.unite})` : "Qté"} inputMode="decimal" value={l.quantite}
                  onChange={(e) => maj(l.cle, "quantite", e.target.value)} />
                <button type="button" aria-label="Retirer la ligne" disabled={lignes.length === 1}
                  className="mb-1 rounded-lg px-2 py-2 text-texte-2 hover:text-accent disabled:opacity-30"
                  onClick={() => setLignes((ls) => ls.filter((x) => x.cle !== l.cle))}>✕</button>
              </div>
            );
          })}
          <button type="button" className="self-start text-sm font-semibold text-primaire" onClick={() => setLignes((ls) => [...ls, nouvelleLigne()])}>
            + Ajouter un article
          </button>
        </Carte>

        <Carte className="flex flex-col gap-3">
          <h2 className="font-semibold">Client et paiement</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">Client</span>
              <select className={choix} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">{clients.length ? "Client de passage" : "Aucun client enregistré"}</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </label>
            {!clientId && <Champ label="…ou nouveau client" value={nouveauClient} onChange={(e) => setNouveauClient(e.target.value)} placeholder="Fatou Diop" />}
          </div>
          <fieldset className="flex flex-wrap gap-2 text-sm">
            <legend className="mb-1.5 font-medium">Paiement</legend>
            {([["total", "Payé en espèces"], ["partiel", "Payé en partie"], ["ardoise", "Sur l'ardoise"]] as const).map(([v, label]) => (
              <label key={v} className={`cursor-pointer rounded-xl border px-3 py-2 ${paiement === v ? "border-primaire bg-primaire/10 font-semibold" : "border-bordure"}`}>
                <input type="radio" name="paiement" value={v} checked={paiement === v} onChange={() => setPaiement(v)} className="sr-only" />
                {label}
              </label>
            ))}
          </fieldset>
          {paiement === "partiel" && (
            <Champ label="Montant reçu en espèces (FCFA)" inputMode="numeric" value={montantPartiel}
              onChange={(e) => setMontantPartiel(e.target.value.replace(/\D/g, ""))} />
          )}
          <p className="text-xs text-texte-2">Wave, Orange Money et Free Money arriveront avec l'intégration PayDunya.</p>
        </Carte>
      </div>

      <Carte className="flex h-fit flex-col gap-3 lg:sticky lg:top-20">
        <h2 className="font-semibold">Récapitulatif</h2>
        {totaux ? (
          <dl className="flex flex-col gap-1.5 text-sm tabular-nums">
            <div className="flex justify-between"><dt>Total HT</dt><dd>{formaterFcfa(totaux.totalHt)}</dd></div>
            {totaux.tvaParTaux.filter((x) => x.taux > 0).map((x) => (
              <div key={x.taux} className="flex justify-between text-texte-2"><dt>TVA {x.taux} %</dt><dd>{formaterFcfa(x.montantTva)}</dd></div>
            ))}
            {!session.commerce!.assujettiTva && <p className="text-xs text-texte-2">TVA non applicable</p>}
            <div className="mt-1 flex justify-between border-t border-bordure pt-2 text-lg font-bold"><dt>Total TTC</dt><dd>{formaterFcfa(totaux.totalTtc)}</dd></div>
          </dl>
        ) : (
          <p className="text-sm text-texte-2">Ajoutez au moins un article.</p>
        )}
        <Erreur>{erreur}</Erreur>
        <Bouton type="submit" disabled={!totaux || enCours}>{enCours ? "Enregistrement…" : "Enregistrer la vente"}</Bouton>
      </Carte>
    </form>
  );
}
