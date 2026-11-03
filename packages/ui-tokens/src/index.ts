/** Charte Kazimara — identité visuelle (proposition). */
export const couleurs = {
  /** Croissance, confiance, durabilité. RVB 31 92 69 */
  vertBaobab: "#1F5C45",
  /** Le travail, la terre, l'artisanat africain. RVB 210 102 43 */
  terreCuite: "#D2662B",
  /** Prospérité, réussite, énergie. RVB 242 179 61 */
  orSoleil: "#F2B33D",
  /** Texte et fond sombre. */
  encre: "#10201A",
  /** Fond clair, crème. */
  creme: "#F6F2EA",
  papier: "#FFFDF8",
  bordure: "#E6DFD2",
  texteSecondaire: "#5B6660",
} as const;

export const theme = {
  clair: {
    fond: couleurs.creme,
    surface: couleurs.papier,
    texte: couleurs.encre,
    texteSecondaire: couleurs.texteSecondaire,
    primaire: couleurs.vertBaobab,
    accent: couleurs.terreCuite,
    mise_en_avant: couleurs.orSoleil,
    bordure: couleurs.bordure,
  },
  sombre: {
    fond: couleurs.encre,
    surface: "#1A2E26",
    texte: couleurs.creme,
    texteSecondaire: "#A9B5AE",
    primaire: "#3E8C6C",
    accent: couleurs.terreCuite,
    mise_en_avant: couleurs.orSoleil,
    bordure: "#2B4238",
  },
} as const;

export const typographie = {
  famille: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  graisses: { normal: 400, moyen: 500, gras: 700, extraGras: 800 },
  tailles: { xs: 12, sm: 14, base: 16, lg: 18, xl: 22, "2xl": 28, "3xl": 36 },
} as const;

/** Espacements en px (grille de 4). */
export const espacements = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 } as const;
export const rayons = { sm: 6, md: 10, lg: 16, xl: 24, rond: 9999 } as const;

export const slogan = { fr: "Le travail solide", en: "Solid work" } as const;
