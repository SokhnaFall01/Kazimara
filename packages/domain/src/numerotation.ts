/**
 * Numérotation des factures : une série par boutique et par année, format FAC-2026-000001.
 * Hors-ligne, chaque appareil pioche dans une plage réservée d'avance par le serveur (§7).
 */
export const PREFIXE_FACTURE = "FAC";
export const PREFIXE_AVOIR = "AV";
export const TAILLE_PLAGE_DEFAUT = 100;
export const SEUIL_RENOUVELLEMENT_PLAGE = 20;

export function formaterNumeroFacture(annee: number, sequence: number, prefixe = PREFIXE_FACTURE): string {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 999_999) {
    throw new RangeError(`séquence de facture invalide : ${sequence}`);
  }
  return `${prefixe}-${annee}-${String(sequence).padStart(6, "0")}`;
}

const MOTIF = /^(FAC|AV)-(\d{4})-(\d{6})$/;

export function analyserNumeroFacture(numero: string): { prefixe: string; annee: number; sequence: number } {
  const m = MOTIF.exec(numero);
  if (!m) throw new SyntaxError(`numéro de facture invalide : ${numero}`);
  return { prefixe: m[1]!, annee: Number(m[2]), sequence: Number(m[3]) };
}

/** Plage [debut, fin] incluse, réservée par le serveur pour un appareil. */
export interface PlageNumeros {
  annee: number;
  debut: number;
  fin: number;
  /** Prochaine séquence à utiliser. */
  prochain: number;
}

export function numerosRestants(p: PlageNumeros): number {
  return Math.max(0, p.fin - p.prochain + 1);
}

export function doitRenouvelerPlage(p: PlageNumeros, seuil = SEUIL_RENOUVELLEMENT_PLAGE): boolean {
  return numerosRestants(p) < seuil;
}

/** Tire le prochain numéro de la plage ; renvoie le numéro et la plage mise à jour. */
export function tirerNumero(p: PlageNumeros): { numero: string; plage: PlageNumeros } {
  if (numerosRestants(p) === 0) throw new RangeError("plage de numéros épuisée");
  return { numero: formaterNumeroFacture(p.annee, p.prochain), plage: { ...p, prochain: p.prochain + 1 } };
}
