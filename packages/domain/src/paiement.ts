import { assertFcfa, type Fcfa } from "./money.js";

export const METHODES_PAIEMENT = ["especes", "wave", "orange_money", "free_money", "carte"] as const;
export type MethodePaiement = (typeof METHODES_PAIEMENT)[number];

export const STATUTS_PAIEMENT_VENTE = ["non_payee", "payee_en_partie", "payee"] as const;
export type StatutPaiementVente = (typeof STATUTS_PAIEMENT_VENTE)[number];

export type StatutPaiement = "en_attente" | "confirme" | "echoue" | "expire";

export interface PaiementResume {
  montant: Fcfa;
  statut: StatutPaiement;
}

export interface EtatPaiementVente {
  statut: StatutPaiementVente;
  dejaPaye: Fcfa;
  resteAPayer: Fcfa;
}

/**
 * Seuls les paiements confirmés comptent (pour le mobile money : confirmés par PayDunya,
 * jamais sur la seule parole du téléphone — architecture §8).
 */
export function etatPaiement(totalTtc: Fcfa, paiements: PaiementResume[]): EtatPaiementVente {
  assertFcfa(totalTtc, "total TTC");
  const dejaPaye = paiements
    .filter((p) => p.statut === "confirme")
    .reduce((s, p) => (assertFcfa(p.montant), s + p.montant), 0);
  const resteAPayer = Math.max(0, totalTtc - dejaPaye);
  const statut: StatutPaiementVente =
    dejaPaye <= 0 ? "non_payee" : resteAPayer === 0 ? "payee" : "payee_en_partie";
  return { statut, dejaPaye, resteAPayer };
}

/** Solde d'ardoise d'un client : somme de ce qui reste à payer sur ses ventes. */
export function soldeArdoise(ventes: Array<{ totalTtc: Fcfa; paiements: PaiementResume[] }>): Fcfa {
  return ventes.reduce((s, v) => s + etatPaiement(v.totalTtc, v.paiements).resteAPayer, 0);
}
