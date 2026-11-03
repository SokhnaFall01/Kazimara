import { METHODES_PAIEMENT, normaliserTelephoneSn, STATUTS_PAIEMENT_VENTE } from "@kazimara/domain";
import { z } from "zod";

/** Mêmes règles sur mobile, web et serveur (architecture §2). */

export const uuid = z.string().uuid();
export const fcfa = z.number().int("montant en entier FCFA");
export const fcfaPositif = fcfa.nonnegative();
export const dateIso = z.string().datetime({ offset: true });

export const telephoneSn = z
  .string()
  .transform((v, ctx) => {
    const n = normaliserTelephoneSn(v);
    if (!n) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "TELEPHONE_INVALIDE" });
      return z.NEVER;
    }
    return n;
  });

export const langue = z.enum(["fr", "en"]);
export const methodePaiement = z.enum(METHODES_PAIEMENT);
export const statutPaiementVente = z.enum(STATUTS_PAIEMENT_VENTE);
export const sourceVente = z.enum(["app", "web", "whatsapp"]);

// --- Auth ---
export const demanderOtp = z.object({ telephone: telephoneSn });
export const verifierOtp = z.object({
  telephone: telephoneSn,
  code: z.string().regex(/^\d{6}$/, "CODE_INVALIDE"),
  appareil: z.object({ id: uuid, plateforme: z.enum(["ios", "android", "web"]), pushToken: z.string().optional() }),
});

// --- Catalogue ---
export const produitEntree = z.object({
  id: uuid,
  nom: z.string().trim().min(1).max(120),
  prixHt: fcfaPositif,
  tauxTva: z.union([z.literal(18), z.literal(10), z.literal(0)]),
  unite: z.string().trim().min(1).max(20).default("unité"),
  seuilAlerte: z.number().nonnegative().default(0),
  actif: z.boolean().default(true),
});

export const clientEntree = z.object({
  id: uuid,
  nom: z.string().trim().min(1).max(120),
  telephone: telephoneSn.optional(),
  ninea: z.string().trim().max(20).optional(),
});

// --- Ventes ---
export const ligneVenteEntree = z.object({
  produitId: uuid.optional(),
  libelle: z.string().trim().min(1).max(200),
  quantite: z.number().positive().multipleOf(0.001),
  prixUnitaireHt: fcfaPositif,
  tauxTva: z.number().int().min(0).max(100),
});

/**
 * Le téléphone n'envoie jamais les totaux : le serveur les recalcule (le serveur fait foi).
 * `numeroFacture` n'est présent que pour une vente hors-ligne tirée d'une plage réservée.
 */
export const venteEntree = z.object({
  id: uuid,
  clientId: uuid.optional(),
  date: dateIso,
  lignes: z.array(ligneVenteEntree).min(1).max(200),
  source: sourceVente,
  numeroFacture: z.string().regex(/^FAC-\d{4}-\d{6}$/).optional(),
  paiementEspeces: fcfaPositif.optional(),
});

export const paiementEspecesEntree = z.object({ id: uuid, montant: fcfa.positive(), date: dateIso });
export const paiementMobileMoneyEntree = z.object({
  id: uuid,
  montant: fcfa.positive(),
  methode: z.enum(["wave", "orange_money", "free_money", "carte"]),
});

export const depenseEntree = z.object({
  id: uuid,
  date: dateIso,
  montant: fcfa.positive(),
  categorie: z.string().trim().min(1).max(60),
  libelle: z.string().trim().min(1).max(200),
  methode: methodePaiement,
});

export const mouvementStockEntree = z.object({
  id: uuid,
  produitId: uuid,
  type: z.enum(["reception", "ajustement"]),
  quantite: z.number().refine((q) => q !== 0, "QUANTITE_NULLE"),
  reference: z.string().max(120).optional(),
});

// --- Synchronisation hors-ligne ---
export const evenementSync = z.discriminatedUnion("type", [
  z.object({ id: uuid, type: z.literal("vente.creee"), payload: venteEntree }),
  z.object({ id: uuid, type: z.literal("paiement.especes"), payload: paiementEspecesEntree.extend({ venteId: uuid }) }),
  z.object({ id: uuid, type: z.literal("depense.creee"), payload: depenseEntree }),
  z.object({ id: uuid, type: z.literal("stock.mouvement"), payload: mouvementStockEntree }),
  z.object({ id: uuid, type: z.literal("produit.modifie"), payload: produitEntree.extend({ version: z.number().int() }) }),
  z.object({ id: uuid, type: z.literal("client.modifie"), payload: clientEntree.extend({ version: z.number().int() }) }),
]);

export const lotSync = z.object({
  appareilId: uuid,
  evenements: z.array(evenementSync).min(1).max(50),
});

// --- Réponses ---
export const CODES_ERREUR = [
  "VALIDATION", "NON_AUTHENTIFIE", "INTERDIT", "INTROUVABLE", "CONFLIT_VERSION",
  "STOCK_INSUFFISANT", "PLAGE_EPUISEE", "OTP_INVALIDE", "OTP_TROP_DE_DEMANDES",
  "TELEPHONE_INVALIDE", "PAIEMENT_REFUSE", "TROP_DE_REQUETES", "ERREUR_INTERNE",
] as const;

export const erreurApi = z.object({
  error: z.object({ code: z.enum(CODES_ERREUR), message: z.string(), details: z.unknown().optional() }),
});

export type DemanderOtp = z.infer<typeof demanderOtp>;
export type VerifierOtp = z.infer<typeof verifierOtp>;
export type ProduitEntree = z.infer<typeof produitEntree>;
export type ClientEntree = z.infer<typeof clientEntree>;
export type VenteEntree = z.infer<typeof venteEntree>;
export type DepenseEntree = z.infer<typeof depenseEntree>;
export type EvenementSync = z.infer<typeof evenementSync>;
export type LotSync = z.infer<typeof lotSync>;
export type CodeErreur = (typeof CODES_ERREUR)[number];
