import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const variantes = {
  primaire: "bg-primaire text-creme hover:brightness-110",
  secondaire: "border border-bordure bg-surface text-texte hover:bg-fond",
  accent: "bg-accent text-white hover:brightness-110",
} as const;
const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50";

export function Bouton({ variante = "primaire", className = "", ...p }: ComponentProps<"button"> & { variante?: keyof typeof variantes }) {
  return <button className={`${base} ${variantes[variante]} ${className}`} {...p} />;
}

export function LienBouton({ variante = "primaire", className = "", ...p }: ComponentProps<typeof Link> & { variante?: keyof typeof variantes }) {
  return <Link className={`${base} ${variantes[variante]} ${className}`} {...p} />;
}

export function Champ({ label, aide, className = "", ...p }: ComponentProps<"input"> & { label: string; aide?: ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      <input className="rounded-xl border border-bordure bg-surface px-3 py-2.5 text-base outline-none focus:border-primaire" {...p} />
      {aide && <span className="text-xs text-texte-2">{aide}</span>}
    </label>
  );
}

export function Carte({ className = "", ...p }: ComponentProps<"div">) {
  return <div className={`rounded-2xl border border-bordure bg-surface p-5 ${className}`} {...p} />;
}

export function Erreur({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p role="alert" className="rounded-xl bg-accent/10 px-3 py-2 text-sm text-accent">{children}</p>;
}

export function Pastille({ ton, children }: { ton: "vert" | "orange" | "gris"; children: ReactNode }) {
  const tons = { vert: "bg-primaire/15 text-primaire", orange: "bg-accent/15 text-accent", gris: "bg-texte-2/15 text-texte-2" };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tons[ton]}`}>{children}</span>;
}
