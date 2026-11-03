import en from "./locales/en.json";
import fr from "./locales/fr.json";

export type Dictionnaire = typeof fr;
export type Langue = "fr" | "en";

/** L'anglais doit avoir exactement les mêmes clés que le français (vérifié à la compilation). */
const enVerifie: Dictionnaire = en;

export const dictionnaires: Record<Langue, Dictionnaire> = { fr, en: enVerifie };
export const LANGUE_PAR_DEFAUT: Langue = "fr";

type Chemins<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Chemins<T[K], `${P}${K}.`>;
}[keyof T & string];
export type Cle = Chemins<Dictionnaire>;

export function t(langue: Langue, cle: Cle, variables: Record<string, string | number> = {}): string {
  const valeur = cle.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], dictionnaires[langue]);
  if (typeof valeur !== "string") return cle;
  return valeur.replace(/\{(\w+)\}/g, (_, v: string) => String(variables[v] ?? `{${v}}`));
}
