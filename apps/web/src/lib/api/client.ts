import type { VenteEntree } from "@kazimara/schemas";
import type { Client, Commerce, Produit, Session, TableauDeBord, Vente } from "./types";

/**
 * Contrat de l'API Kazimara vu par le web (architecture §11, /api/v1).
 * Deux implémentations : `mock` (navigateur, pour avancer sans serveur) et `http` (API NestJS).
 * Les écrans n'utilisent que cette interface : brancher le vrai serveur ne change aucun écran.
 */
export interface KazimaraApi {
  // auth — POST /auth/otp/demander, /auth/otp/verifier, /auth/deconnexion
  demanderOtp(telephone: string): Promise<{ telephone: string; codeDev?: string }>;
  verifierOtp(telephone: string, code: string): Promise<Session>;
  session(): Promise<Session | null>;
  deconnexion(): Promise<void>;

  // commerce — GET, PATCH /boutique
  enregistrerCommerce(donnees: Omit<Commerce, "id" | "telephone">): Promise<Commerce>;

  // catalogue — /produits
  listerProduits(): Promise<Produit[]>;
  creerProduit(p: Omit<Produit, "id" | "stockActuel"> & { stockInitial: number }): Promise<Produit>;

  // clients — /clients
  listerClients(): Promise<Client[]>;
  creerClient(c: Omit<Client, "id">): Promise<Client>;

  // ventes — /ventes
  listerVentes(): Promise<Vente[]>;
  creerVente(v: VenteEntree): Promise<Vente>;

  // tableau de bord — GET /tableau-de-bord
  tableauDeBord(): Promise<TableauDeBord>;
}
