/** Symbole Kazimara (pilier, briques, soleil, élan). Le pilier suit le thème clair/sombre. */
export function Symbole({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <rect x="10" y="22" width="22" height="88" rx="4" className="fill-baobab dark:fill-creme" />
      <g fill="none" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-creme dark:stroke-baobab">
        <path d="M15 42 l6 -6 l6 6" /><path d="M15 54 l6 -6 l6 6" /><path d="M15 66 l6 -6 l6 6" />
      </g>
      <rect x="38" y="56" width="18" height="18" rx="3" fill="#D2662B" />
      <rect x="62" y="34" width="18" height="18" rx="3" fill="#D2662B" />
      <circle cx="94" cy="20" r="9" fill="#F2B33D" />
      <path d="M38 80 H60 L94 110 H72 Z" fill="#F2B33D" />
    </svg>
  );
}

export function Logo({ slogan = false, taille = "md" }: { slogan?: boolean; taille?: "md" | "lg" }) {
  const grand = taille === "lg";
  return (
    <span className="inline-flex items-center gap-2.5">
      <Symbole className={grand ? "h-14 w-14" : "h-9 w-9"} />
      <span className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-wide ${grand ? "text-4xl" : "text-xl"}`}>KAZIMARA</span>
        {slogan && <span className={`mt-1 font-medium text-accent ${grand ? "text-base" : "text-xs"}`}>Le travail solide</span>}
      </span>
      <span className="sr-only">Kazimara</span>
    </span>
  );
}
