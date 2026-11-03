import { t } from "@kazimara/i18n";
import { ErreurApi } from "./api";

/** Message traduit à partir du code d'erreur de l'API (architecture §11). */
export function messageErreur(e: unknown): string {
  if (e instanceof ErreurApi) return t("fr", `erreurs.${e.code}`);
  return t("fr", "erreurs.ERREUR_INTERNE");
}
