/** Numéros sénégalais uniquement en V1 (blocage des préfixes étrangers, §6). */
const MOBILE_SN = /^7[05678]\d{7}$/;

/** Normalise vers le format E.164 (+221XXXXXXXXX) ou renvoie null si le numéro n'est pas un mobile sénégalais. */
export function normaliserTelephoneSn(saisie: string): string | null {
  let n = saisie.replace(/[\s.\-()]/g, "");
  if (n.startsWith("+221")) n = n.slice(4);
  else if (n.startsWith("00221")) n = n.slice(5);
  else if (n.startsWith("221") && n.length === 12) n = n.slice(3);
  return MOBILE_SN.test(n) ? `+221${n}` : null;
}
