/**
 * Montants en francs CFA (XOF), toujours en entiers : le franc CFA n'a pas de centimes.
 * Jamais de nombres à virgule pour l'argent (architecture §5).
 */
export type Fcfa = number;

export function assertFcfa(value: number, label = "montant"): asserts value is Fcfa {
  if (!Number.isSafeInteger(value)) {
    throw new RangeError(`${label} doit être un entier FCFA (reçu : ${value})`);
  }
}

/** Arrondi commercial au franc le plus proche (0,5 → supérieur), y compris pour les négatifs (avoirs). */
export function arrondirFcfa(value: number): Fcfa {
  const sign = value < 0 ? -1 : 1;
  return sign * Math.floor(Math.abs(value) + 0.5 + Number.EPSILON);
}

const formateur = new Intl.NumberFormat("fr-SN", { maximumFractionDigits: 0 });

/** 12500 → "12 500 FCFA" */
export function formaterFcfa(montant: Fcfa): string {
  return `${formateur.format(montant).replace(/\s/g, " ")} FCFA`;
}
