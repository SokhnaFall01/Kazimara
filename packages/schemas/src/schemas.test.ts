import { describe, expect, it } from "vitest";
import { demanderOtp, lotSync, venteEntree } from "./index";

const id = "0192f4b0-7c3a-7a11-9b2e-3f1c2d4e5a6b";

describe("schémas partagés", () => {
  it("normalise le téléphone", () => {
    expect(demanderOtp.parse({ telephone: "77 123 45 67" })).toEqual({ telephone: "+221771234567" });
    expect(demanderOtp.safeParse({ telephone: "+33612345678" }).success).toBe(false);
  });
  it("refuse un prix à virgule", () => {
    const r = venteEntree.safeParse({
      id, date: "2026-11-03T10:00:00Z", source: "app",
      lignes: [{ libelle: "Riz", quantite: 1, prixUnitaireHt: 10.5, tauxTva: 18 }],
    });
    expect(r.success).toBe(false);
  });
  it("limite les lots de synchronisation à 50 événements", () => {
    const ev = { id, type: "depense.creee", payload: { id, date: "2026-11-03T10:00:00Z", montant: 500, categorie: "Transport", libelle: "Taxi", methode: "especes" } };
    expect(lotSync.safeParse({ appareilId: id, evenements: Array(50).fill(ev) }).success).toBe(true);
    expect(lotSync.safeParse({ appareilId: id, evenements: Array(51).fill(ev) }).success).toBe(false);
  });
});
