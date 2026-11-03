import type { Fcfa } from "./money";
import type { MethodePaiement, StatutPaiement } from "./paiement";

/**
 * Le livre de caisse n'est pas une table saisie : il est calculé à partir des paiements
 * confirmés (entrées) et des dépenses (sorties). Il ne peut donc pas diverger des ventes (§5).
 */
export interface PaiementCaisse {
  date: string; // ISO 8601
  montant: Fcfa;
  methode: MethodePaiement;
  statut: StatutPaiement;
  reference: string;
}

export interface DepenseCaisse {
  date: string;
  montant: Fcfa; // négatif pour une écriture inverse
  libelle: string;
  reference: string;
}

export interface EcritureCaisse {
  date: string;
  sens: "entree" | "sortie";
  montant: Fcfa;
  libelle: string;
  reference: string;
  solde: Fcfa;
}

export interface LivreDeCaisse {
  soldeOuverture: Fcfa;
  totalEntrees: Fcfa;
  totalSorties: Fcfa;
  soldeCloture: Fcfa;
  ecritures: EcritureCaisse[];
}

export function livreDeCaisse(
  paiements: PaiementCaisse[],
  depenses: DepenseCaisse[],
  soldeOuverture: Fcfa = 0,
): LivreDeCaisse {
  const mouvements = [
    ...paiements
      .filter((p) => p.statut === "confirme")
      .map((p) => ({ date: p.date, sens: "entree" as const, montant: p.montant, libelle: `Encaissement ${p.methode}`, reference: p.reference })),
    ...depenses.map((d) => ({ date: d.date, sens: "sortie" as const, montant: d.montant, libelle: d.libelle, reference: d.reference })),
  ].sort((a, b) => a.date.localeCompare(b.date) || a.reference.localeCompare(b.reference));

  let solde = soldeOuverture;
  let totalEntrees = 0;
  let totalSorties = 0;
  const ecritures = mouvements.map((m) => {
    if (m.sens === "entree") { solde += m.montant; totalEntrees += m.montant; }
    else { solde -= m.montant; totalSorties += m.montant; }
    return { ...m, solde };
  });
  return { soldeOuverture, totalEntrees, totalSorties, soldeCloture: solde, ecritures };
}
