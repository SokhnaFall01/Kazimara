import { arrondirFcfa, assertFcfa, type Fcfa } from "./money.js";

/** Taux de TVA au Sénégal, en pourcentage entier. */
export const TAUX_TVA_NORMAL = 18;
export const TAUX_TVA_REDUIT = 10;
export const TAUX_TVA_EXONERE = 0;

export interface LigneSaisie {
  libelle: string;
  /** Quantité ; décimales autorisées (kg, litres), 3 maximum. */
  quantite: number;
  prixUnitaireHt: Fcfa;
  /** Pourcentage entier : 18, 10 ou 0. */
  tauxTva: number;
}

export interface LigneCalculee extends LigneSaisie {
  totalLigneHt: Fcfa;
}

export interface TvaParTaux {
  taux: number;
  baseHt: Fcfa;
  montantTva: Fcfa;
}

export interface TotauxVente {
  lignes: LigneCalculee[];
  totalHt: Fcfa;
  tvaParTaux: TvaParTaux[];
  totalTva: Fcfa;
  totalTtc: Fcfa;
}

export interface OptionsCalcul {
  /** Paramètre `assujetti_tva` de la boutique : si faux, aucune TVA n'est facturée. */
  assujettiTva: boolean;
}

function verifierLigne(l: LigneSaisie, i: number): void {
  if (!(l.quantite > 0) || !Number.isFinite(l.quantite)) {
    throw new RangeError(`ligne ${i + 1} : la quantité doit être positive`);
  }
  if (Math.round(l.quantite * 1000) !== l.quantite * 1000) {
    throw new RangeError(`ligne ${i + 1} : 3 décimales maximum pour la quantité`);
  }
  assertFcfa(l.prixUnitaireHt, `ligne ${i + 1} : prix unitaire HT`);
  if (l.prixUnitaireHt < 0) throw new RangeError(`ligne ${i + 1} : prix négatif`);
  if (!Number.isInteger(l.tauxTva) || l.tauxTva < 0 || l.tauxTva > 100) {
    throw new RangeError(`ligne ${i + 1} : taux de TVA invalide (${l.tauxTva})`);
  }
}

/**
 * Calcule les totaux d'une vente. Le serveur fait foi : cette fonction est rejouée côté API
 * pour recalculer tout montant envoyé par le téléphone (architecture §2, principe 1).
 *
 * Règle d'arrondi : total de ligne HT arrondi au franc, puis TVA calculée par taux
 * sur la base HT cumulée (et non ligne par ligne), arrondie au franc.
 */
export function calculerTotaux(lignes: LigneSaisie[], options: OptionsCalcul): TotauxVente {
  if (lignes.length === 0) throw new RangeError("une vente contient au moins une ligne");

  const calculees: LigneCalculee[] = lignes.map((l, i) => {
    verifierLigne(l, i);
    const tauxTva = options.assujettiTva ? l.tauxTva : TAUX_TVA_EXONERE;
    return { ...l, tauxTva, totalLigneHt: arrondirFcfa(l.quantite * l.prixUnitaireHt) };
  });

  const bases = new Map<number, Fcfa>();
  for (const l of calculees) bases.set(l.tauxTva, (bases.get(l.tauxTva) ?? 0) + l.totalLigneHt);

  const tvaParTaux: TvaParTaux[] = [...bases.entries()]
    .sort(([a], [b]) => b - a)
    .map(([taux, baseHt]) => ({ taux, baseHt, montantTva: arrondirFcfa((baseHt * taux) / 100) }));

  const totalHt = calculees.reduce((s, l) => s + l.totalLigneHt, 0);
  const totalTva = tvaParTaux.reduce((s, t) => s + t.montantTva, 0);

  return { lignes: calculees, totalHt, tvaParTaux, totalTva, totalTtc: totalHt + totalTva };
}
