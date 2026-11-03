"use client";

import {
  calculerTotaux, etatPaiement, formaterNumeroFacture, normaliserTelephoneSn,
} from "@kazimara/domain";
import { venteEntree, type VenteEntree } from "@kazimara/schemas";
import type { KazimaraApi } from "./client";
import { ErreurApi, type Client, type Commerce, type Produit, type Session, type Vente } from "./types";

/**
 * API simulée dans le navigateur (localStorage) pour développer le web avant le backend.
 * Elle applique les mêmes règles que le futur serveur grâce à @kazimara/domain et @kazimara/schemas.
 * Code OTP de développement : 123456.
 */
const CLE = "kazimara.mock.v1";
const CODE_DEV = "123456";

interface Etat {
  session: Session | null;
  otpEnAttente: string | null;
  commerces: Record<string, Commerce>; // par téléphone
  produits: Produit[];
  clients: Client[];
  ventes: Vente[];
  sequence: number;
}

const vide = (): Etat => ({ session: null, otpEnAttente: null, commerces: {}, produits: [], clients: [], ventes: [], sequence: 0 });

function lire(): Etat {
  try {
    const brut = localStorage.getItem(CLE);
    return brut ? { ...vide(), ...JSON.parse(brut) } : vide();
  } catch {
    return vide();
  }
}

function ecrire(e: Etat) {
  try { localStorage.setItem(CLE, JSON.stringify(e)); } catch { /* navigation privée */ }
}

const attendre = () => new Promise((r) => setTimeout(r, 150));

function exigerSession(e: Etat): Commerce {
  if (!e.session) throw new ErreurApi("NON_AUTHENTIFIE", "Session expirée");
  if (!e.session.commerce) throw new ErreurApi("INTERDIT", "Fiche commerce à créer");
  return e.session.commerce;
}

function produitsDeDemo(): Produit[] {
  const p = (nom: string, prixHt: number, unite: string, stockActuel: number, seuilAlerte: number): Produit => ({
    id: crypto.randomUUID(), nom, prixHt, tauxTva: 18, unite, stockActuel, seuilAlerte, actif: true,
  });
  return [
    p("Sac de riz 25 kg", 15000, "sac", 12, 5),
    p("Huile 5 L", 6500, "bidon", 3, 4),
    p("Sucre 1 kg", 700, "kg", 40, 10),
    p("Savon de Marseille", 400, "unité", 25, 10),
  ];
}

export const apiMock: KazimaraApi = {
  async demanderOtp(saisie) {
    await attendre();
    const telephone = normaliserTelephoneSn(saisie);
    if (!telephone) throw new ErreurApi("TELEPHONE_INVALIDE", "Numéro invalide");
    const e = lire();
    e.otpEnAttente = telephone;
    ecrire(e);
    return { telephone, codeDev: CODE_DEV };
  },

  async verifierOtp(telephone, code) {
    await attendre();
    const e = lire();
    if (e.otpEnAttente !== telephone || code !== CODE_DEV) throw new ErreurApi("OTP_INVALIDE", "Code incorrect");
    e.otpEnAttente = null;
    e.session = { telephone, commerce: e.commerces[telephone] ?? null };
    ecrire(e);
    return e.session;
  },

  async session() {
    return lire().session;
  },

  async deconnexion() {
    const e = lire();
    e.session = null;
    ecrire(e);
  },

  async enregistrerCommerce(donnees) {
    await attendre();
    const e = lire();
    if (!e.session) throw new ErreurApi("NON_AUTHENTIFIE", "Session expirée");
    const existant = e.commerces[e.session.telephone];
    const commerce: Commerce = { ...donnees, id: existant?.id ?? crypto.randomUUID(), telephone: e.session.telephone };
    e.commerces[commerce.telephone] = commerce;
    e.session.commerce = commerce;
    if (!existant && e.produits.length === 0) e.produits = produitsDeDemo();
    ecrire(e);
    return commerce;
  },

  async listerProduits() {
    const e = lire();
    exigerSession(e);
    return e.produits;
  },

  async creerProduit({ stockInitial, ...p }) {
    await attendre();
    const e = lire();
    exigerSession(e);
    const produit: Produit = { ...p, id: crypto.randomUUID(), stockActuel: stockInitial };
    e.produits.push(produit);
    ecrire(e);
    return produit;
  },

  async listerClients() {
    const e = lire();
    exigerSession(e);
    return e.clients;
  },

  async creerClient(c) {
    await attendre();
    const e = lire();
    exigerSession(e);
    const client: Client = { ...c, id: crypto.randomUUID() };
    e.clients.push(client);
    ecrire(e);
    return client;
  },

  async listerVentes() {
    const e = lire();
    exigerSession(e);
    return [...e.ventes].sort((a, b) => b.date.localeCompare(a.date));
  },

  async creerVente(entree: VenteEntree) {
    await attendre();
    const e = lire();
    const commerce = exigerSession(e);
    const v = venteEntree.parse(entree);
    // Le serveur fait foi : totaux recalculés ici, jamais repris du formulaire.
    const totaux = calculerTotaux(v.lignes, { assujettiTva: commerce.assujettiTva });
    for (const l of v.lignes) {
      const p = e.produits.find((x) => x.id === l.produitId);
      if (p) p.stockActuel -= l.quantite; // accepté même sous zéro (§7), l'alerte se lève
    }
    e.sequence += 1;
    const paiements = v.paiementEspeces
      ? [{ id: crypto.randomUUID(), montant: Math.min(v.paiementEspeces, totaux.totalTtc), methode: "especes" as const, statut: "confirme" as const, date: v.date }]
      : [];
    const vente: Vente = {
      ...totaux,
      ...etatPaiement(totaux.totalTtc, paiements),
      id: v.id,
      numeroFacture: formaterNumeroFacture(new Date(v.date).getFullYear(), e.sequence),
      date: v.date,
      clientId: v.clientId,
      clientNom: e.clients.find((c) => c.id === v.clientId)?.nom,
      source: "web",
      paiements,
    };
    e.ventes.push(vente);
    ecrire(e);
    return vente;
  },

  async tableauDeBord() {
    const e = lire();
    exigerSession(e);
    const maintenant = new Date();
    const jour = maintenant.toISOString().slice(0, 10);
    const mois = jour.slice(0, 7);
    const duMois = e.ventes.filter((v) => v.date.startsWith(mois));
    return {
      ventesDuJour: e.ventes.filter((v) => v.date.startsWith(jour)).reduce((s, v) => s + v.totalTtc, 0),
      ventesDuMois: duMois.reduce((s, v) => s + v.totalTtc, 0),
      encaisseDuMois: duMois.reduce((s, v) => s + v.dejaPaye, 0),
      resteAEncaisser: e.ventes.reduce((s, v) => s + v.resteAPayer, 0),
      stockBas: e.produits.filter((p) => p.actif && p.stockActuel <= p.seuilAlerte),
    };
  },
};
