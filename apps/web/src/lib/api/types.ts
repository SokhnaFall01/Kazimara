import type { EtatPaiementVente, Fcfa, MethodePaiement, TotauxVente } from "@kazimara/domain";
import type { CodeErreur } from "@kazimara/schemas";

/** Le commerce du commerçant (raison sociale, NINEA, RCCM…). Appelé « boutique » dans l'architecture. */
export interface Commerce {
  id: string;
  nom: string;
  raisonSociale?: string;
  ninea?: string;
  rccm?: string;
  adresse?: string;
  telephone: string;
  assujettiTva: boolean;
  langue: "fr" | "en";
}

export interface Session {
  telephone: string;
  commerce: Commerce | null; // null = première connexion, fiche commerce à créer
}

export interface Produit {
  id: string;
  nom: string;
  prixHt: Fcfa;
  tauxTva: 0 | 10 | 18;
  unite: string;
  stockActuel: number;
  seuilAlerte: number;
  actif: boolean;
}

export interface Client {
  id: string;
  nom: string;
  telephone?: string;
}

export interface Paiement {
  id: string;
  montant: Fcfa;
  methode: MethodePaiement;
  statut: "en_attente" | "confirme" | "echoue" | "expire";
  date: string;
}

export interface Vente extends TotauxVente, EtatPaiementVente {
  id: string;
  numeroFacture: string;
  date: string;
  clientId?: string;
  clientNom?: string;
  source: "app" | "web" | "whatsapp";
  paiements: Paiement[];
}

export interface TableauDeBord {
  ventesDuJour: Fcfa;
  ventesDuMois: Fcfa;
  encaisseDuMois: Fcfa;
  resteAEncaisser: Fcfa;
  stockBas: Produit[];
}

export class ErreurApi extends Error {
  constructor(public code: CodeErreur, message: string) {
    super(message);
  }
}
