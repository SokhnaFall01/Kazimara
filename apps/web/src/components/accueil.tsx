/** Illustrations animées de la page d'accueil (SVG et CSS, sans bibliothèque). */

export function SymboleAnime({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="94" cy="20" r="14" fill="#F2B33D" className="kz-halo" />
      <rect x="10" y="22" width="22" height="88" rx="4" className="kz-pilier fill-baobab dark:fill-creme" />
      <g fill="none" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="stroke-creme dark:stroke-baobab">
        <path d="M15 66 l6 -6 l6 6" className="kz-chevron" style={{ animationDelay: "0s" }} />
        <path d="M15 54 l6 -6 l6 6" className="kz-chevron" style={{ animationDelay: ".3s" }} />
        <path d="M15 42 l6 -6 l6 6" className="kz-chevron" style={{ animationDelay: ".6s" }} />
      </g>
      <path d="M38 80 H60 L94 110 H72 Z" fill="#F2B33D" className="kz-elan" />
      <rect x="38" y="56" width="18" height="18" rx="3" fill="#D2662B" className="kz-brique-1" />
      <rect x="62" y="34" width="18" height="18" rx="3" fill="#D2662B" className="kz-brique-2" />
      <circle cx="94" cy="20" r="9" fill="#F2B33D" className="kz-soleil" />
    </svg>
  );
}

function Onde() {
  return (
    <span className="kz-onde inline-flex h-5 items-center gap-[3px]" aria-hidden="true">
      {[10, 18, 12, 20, 9, 16, 11, 19, 8, 14].map((h, i) => (
        <span key={i} style={{ height: h, animationDelay: `${(i % 5) * 0.12}s` }} />
      ))}
    </span>
  );
}

/** Conversation WhatsApp : note vocale → vente proposée → validée. */
export function ConversationWhatsApp() {
  const bulle = "kz-bulle max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-sm";
  return (
    <div className="kz-flotte mx-auto w-[290px] rounded-[2.2rem] border-[6px] border-encre bg-encre p-1 shadow-2xl dark:border-[#24382f]">
      <div className="overflow-hidden rounded-[1.7rem] bg-[#ECE5DA] dark:bg-[#0E1A15]">
        <div className="flex items-center gap-2 bg-baobab px-4 py-3 text-creme">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-creme/15 text-xs font-bold">K</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Kazimara</p>
            <p className="text-[11px] opacity-75">en ligne</p>
          </div>
        </div>
        <div className="flex min-h-[380px] flex-col gap-2.5 p-3">
          <div className={`${bulle} self-end bg-[#D9FDD3] text-encre dark:bg-[#1F5C45] dark:text-creme`} style={{ animationDelay: ".8s" }}>
            <div className="flex items-center gap-2 text-baobab dark:text-or">
              <span aria-hidden="true">▶</span><Onde /><span className="text-[11px] text-texte-2 dark:text-creme/70">0:06</span>
            </div>
            <p className="mt-1 text-[11px] italic opacity-70">« J’ai vendu trois sacs de riz à Fatou, elle a payé par Wave »</p>
          </div>
          <div className={`${bulle} self-start bg-white text-encre dark:bg-[#1A2E26] dark:text-creme`} style={{ animationDelay: "2s" }}>
            <p className="font-semibold">Vente proposée</p>
            <p className="mt-1">3 × Sac de riz 25 kg</p>
            <p>Client : Fatou Diop</p>
            <p>Paiement : Wave</p>
            <p className="mt-1 font-bold">Total : 53 100 FCFA</p>
          </div>
          <div className="kz-bulle flex gap-1.5 self-start" style={{ animationDelay: "2.6s" }}>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-baobab shadow-sm dark:bg-[#1A2E26] dark:text-or">✓ Valider</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs text-texte-2 shadow-sm dark:bg-[#1A2E26]">Corriger</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs text-texte-2 shadow-sm dark:bg-[#1A2E26]">Annuler</span>
          </div>
          <div className={`${bulle} self-end bg-[#D9FDD3] text-encre dark:bg-[#1F5C45] dark:text-creme`} style={{ animationDelay: "3.4s" }}>✓ Valider</div>
          <div className={`${bulle} self-start bg-white text-encre dark:bg-[#1A2E26] dark:text-creme`} style={{ animationDelay: "4.2s" }}>
            Facture <span className="font-mono font-semibold">FAC-2026-000128</span> enregistrée. Le lien de paiement Wave est envoyé à Fatou. 📄
          </div>
        </div>
      </div>
    </div>
  );
}

export function BandeauDefilant({ elements }: { elements: string[] }) {
  const liste = [...elements, ...elements];
  return (
    <div className="relative overflow-hidden border-y border-bordure bg-surface py-4" aria-label={elements.join(", ")}>
      <div className="kz-defile flex w-max gap-10 whitespace-nowrap" aria-hidden="true">
        {liste.map((e, i) => (
          <span key={i} className="flex items-center gap-10 text-sm font-semibold text-texte-2">
            {e}<span className="h-1.5 w-1.5 rounded-full bg-or" />
          </span>
        ))}
      </div>
    </div>
  );
}
