import { describe, expect, it } from "vitest";
import {
  analyserNumeroFacture, arrondirFcfa, calculerTotaux, doitRenouvelerPlage, etatPaiement,
  formaterFcfa, formaterNumeroFacture, livreDeCaisse, normaliserTelephoneSn, soldeArdoise, tirerNumero,
} from "./index.js";

describe("argent", () => {
  it("arrondit au franc, y compris les avoirs", () => {
    expect(arrondirFcfa(1.5)).toBe(2);
    expect(arrondirFcfa(1.49)).toBe(1);
    expect(arrondirFcfa(-1.5)).toBe(-2);
  });
  it("formate en FCFA", () => {
    expect(formaterFcfa(12500)).toBe("12 500 FCFA");
  });
});

describe("calculerTotaux", () => {
  it("calcule HT, TVA 18 % et TTC", () => {
    const t = calculerTotaux([{ libelle: "Sac de riz 25 kg", quantite: 3, prixUnitaireHt: 15000, tauxTva: 18 }], { assujettiTva: true });
    expect(t.totalHt).toBe(45000);
    expect(t.totalTva).toBe(8100);
    expect(t.totalTtc).toBe(53100);
  });
  it("ventile la TVA par taux et arrondit sur la base cumulée", () => {
    const t = calculerTotaux(
      [
        { libelle: "A", quantite: 1, prixUnitaireHt: 3, tauxTva: 18 },
        { libelle: "B", quantite: 1, prixUnitaireHt: 3, tauxTva: 18 },
        { libelle: "C", quantite: 2, prixUnitaireHt: 1000, tauxTva: 10 },
      ],
      { assujettiTva: true },
    );
    // 6 × 18 % = 1,08 → 1 (et non 0,54 + 0,54 → 1 + 1 = 2)
    expect(t.tvaParTaux).toEqual([
      { taux: 18, baseHt: 6, montantTva: 1 },
      { taux: 10, baseHt: 2000, montantTva: 200 },
    ]);
    expect(t.totalTtc).toBe(2207);
  });
  it("gère les quantités décimales", () => {
    const t = calculerTotaux([{ libelle: "Oignons", quantite: 1.25, prixUnitaireHt: 650, tauxTva: 18 }], { assujettiTva: true });
    expect(t.totalHt).toBe(813); // 812,5 → 813
  });
  it("ne facture aucune TVA si la boutique n'est pas assujettie", () => {
    const t = calculerTotaux([{ libelle: "Savon", quantite: 2, prixUnitaireHt: 500, tauxTva: 18 }], { assujettiTva: false });
    expect(t.totalTva).toBe(0);
    expect(t.totalTtc).toBe(1000);
    expect(t.lignes[0]!.tauxTva).toBe(0);
  });
  it("refuse les montants à virgule et les ventes vides", () => {
    expect(() => calculerTotaux([{ libelle: "x", quantite: 1, prixUnitaireHt: 10.5, tauxTva: 18 }], { assujettiTva: true })).toThrow();
    expect(() => calculerTotaux([], { assujettiTva: true })).toThrow();
    expect(() => calculerTotaux([{ libelle: "x", quantite: 0, prixUnitaireHt: 10, tauxTva: 18 }], { assujettiTva: true })).toThrow();
  });
});

describe("statut de paiement et ardoise", () => {
  it("ignore les paiements non confirmés", () => {
    expect(etatPaiement(10000, [{ montant: 10000, statut: "en_attente" }])).toEqual({ statut: "non_payee", dejaPaye: 0, resteAPayer: 10000 });
  });
  it("passe en partie payée puis payée", () => {
    expect(etatPaiement(10000, [{ montant: 4000, statut: "confirme" }]).statut).toBe("payee_en_partie");
    expect(etatPaiement(10000, [{ montant: 4000, statut: "confirme" }, { montant: 6000, statut: "confirme" }]).statut).toBe("payee");
  });
  it("calcule le solde d'ardoise d'un client", () => {
    expect(soldeArdoise([
      { totalTtc: 10000, paiements: [{ montant: 4000, statut: "confirme" }] },
      { totalTtc: 2500, paiements: [] },
      { totalTtc: 3000, paiements: [{ montant: 3000, statut: "confirme" }] },
    ])).toBe(8500);
  });
});

describe("numérotation des factures", () => {
  it("formate et relit FAC-2026-000001", () => {
    expect(formaterNumeroFacture(2026, 1)).toBe("FAC-2026-000001");
    expect(analyserNumeroFacture("FAC-2026-000042")).toEqual({ prefixe: "FAC", annee: 2026, sequence: 42 });
    expect(() => analyserNumeroFacture("FAC-26-1")).toThrow();
  });
  it("tire dans la plage et demande un renouvellement sous 20 numéros", () => {
    let plage = { annee: 2026, debut: 101, fin: 200, prochain: 101 };
    const r = tirerNumero(plage);
    expect(r.numero).toBe("FAC-2026-000101");
    plage = r.plage;
    expect(doitRenouvelerPlage(plage)).toBe(false);
    expect(doitRenouvelerPlage({ ...plage, prochain: 182 })).toBe(true); // 19 restants
    expect(() => tirerNumero({ ...plage, prochain: 201 })).toThrow();
  });
});

describe("livre de caisse", () => {
  it("se calcule à partir des paiements confirmés et des dépenses", () => {
    const livre = livreDeCaisse(
      [
        { date: "2026-11-03T09:00:00Z", montant: 53100, methode: "especes", statut: "confirme", reference: "P1" },
        { date: "2026-11-03T10:00:00Z", montant: 9999, methode: "wave", statut: "en_attente", reference: "P2" },
      ],
      [{ date: "2026-11-03T12:00:00Z", montant: 5000, libelle: "Transport", reference: "D1" }],
      1000,
    );
    expect(livre.totalEntrees).toBe(53100);
    expect(livre.totalSorties).toBe(5000);
    expect(livre.soldeCloture).toBe(49100);
    expect(livre.ecritures.map((e) => e.solde)).toEqual([54100, 49100]);
  });
});

describe("téléphone", () => {
  it("normalise les mobiles sénégalais et refuse les autres", () => {
    expect(normaliserTelephoneSn("77 123 45 67")).toBe("+221771234567");
    expect(normaliserTelephoneSn("+221 70-123-45-67")).toBe("+221701234567");
    expect(normaliserTelephoneSn("00221781234567")).toBe("+221781234567");
    expect(normaliserTelephoneSn("+33612345678")).toBeNull();
    expect(normaliserTelephoneSn("33 812 34 56")).toBeNull(); // fixe
  });
});
