import { describe, expect, it } from "vitest";
import { dictionnaires, t } from "./index.js";

function cles(o: object, p = ""): string[] {
  return Object.entries(o).flatMap(([k, v]) => (typeof v === "string" ? [p + k] : cles(v, `${p}${k}.`)));
}

describe("i18n", () => {
  it("FR et EN ont les mêmes clés", () => {
    expect(cles(dictionnaires.en).sort()).toEqual(cles(dictionnaires.fr).sort());
  });
  it("remplace les variables", () => {
    expect(t("fr", "ventes.tva", { taux: 18 })).toBe("TVA 18 %");
    expect(t("en", "app.slogan")).toBe("Solid work");
  });
});
