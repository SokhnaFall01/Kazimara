import { Apparition } from "@/components/Apparition";
import { BandeauDefilant, ConversationWhatsApp, SymboleAnime } from "@/components/accueil";
import { Logo } from "@/components/Logo";
import { LienBouton } from "@/components/ui";

const fonctions = [
  { icone: "🧾", titre: "Ventes et factures", texte: "Déclarez une vente en quelques secondes. La facture porte les mentions attendues au Sénégal (NINEA, RCCM, TVA) et part en PDF, avec un QR code qui prouve qu'elle est authentique." },
  { icone: "📲", titre: "Wave, Orange Money, Free Money", texte: "Envoyez un lien de paiement à votre client. La facture passe à « Payée » dès que le paiement est confirmé, jamais avant." },
  { icone: "📒", titre: "L'ardoise", texte: "Fini le cahier qui se perd. Vous voyez d'un coup d'œil ce que chaque client vous doit, et vous le relancez poliment par WhatsApp." },
  { icone: "📦", titre: "Stock", texte: "Le stock baisse tout seul à chaque vente. Kazimara vous prévient quand un produit passe sous son seuil, avant la rupture." },
  { icone: "📊", titre: "Compta simplifiée", texte: "Ventes, encaissements, dépenses : le livre de caisse se remplit tout seul. Vous savez enfin combien vous gagnez vraiment." },
  { icone: "🎙️", titre: "WhatsApp et vocal", texte: "Pas le temps de taper ? Dites votre vente en français ou en wolof. Kazimara prépare tout, vous validez d'un tap." },
];

const etapes = [
  { n: "1", titre: "Je vends", texte: "Je choisis les produits, ou je dicte ma vente sur WhatsApp. Le total HT, la TVA et le TTC se calculent tout seuls." },
  { n: "2", titre: "J'encaisse", texte: "Espèces, mobile money, ou sur l'ardoise. Payé en entier ou en partie : Kazimara suit ce qui reste dû." },
  { n: "3", titre: "Je pilote", texte: "Chaque soir, je vois mes ventes, ce que j'ai encaissé, ce qu'on me doit et ce qu'il faut racheter." },
];

const avantApres = [
  ["Un cahier qui se perd ou se mouille", "Tout est sauvegardé, même si le téléphone se perd"],
  ["Des calculs de TVA à la main", "HT, TVA 18 % et TTC calculés sans erreur"],
  ["« Je te paie demain » oublié", "L'ardoise de chaque client, avec relance WhatsApp"],
  ["La rupture de stock découverte trop tard", "Une alerte avant qu'il ne soit trop tard"],
  ["Pas de facture pour la banque", "Des factures vérifiables par QR code"],
];

const symbole = [
  { couleur: "bg-baobab", titre: "Le pilier", sous: "« imara », la solidité", texte: "La fondation de votre entreprise. Ses chevrons s'inspirent des tissus bogolan et montent, comme la progression." },
  { couleur: "bg-accent", titre: "Les briques", sous: "« kazi », le travail", texte: "Une entreprise se bâtit brique par brique : chaque vente, chaque facture fait monter la marche suivante." },
  { couleur: "bg-or", titre: "Le soleil", sous: "la réussite", texte: "Au sommet de l'escalier : la prospérité et l'avenir que vise chaque entrepreneur." },
];

const questions = [
  { q: "Est-ce que ça marche sans connexion internet ?", r: "Oui. Sur l'application mobile, vous pouvez vendre, encaisser en espèces, mettre sur l'ardoise, saisir une dépense et consulter votre stock sans réseau. Tout se synchronise dès que le réseau revient, sans doublon." },
  { q: "Mes données sont-elles en sécurité ?", r: "Vos données sont chiffrées et strictement séparées de celles des autres commerçants. Vous vous connectez avec votre numéro et un code SMS, puis un code PIN ou votre empreinte. Kazimara ne stocke aucune donnée biométrique." },
  { q: "Est-ce que je dois savoir bien écrire pour l'utiliser ?", r: "Non. Vous pouvez dicter vos ventes par message vocal sur WhatsApp, en français ou en wolof. Rien n'est enregistré sans que vous l'ayez validé." },
  { q: "Mes factures sont-elles valables pour la banque ?", r: "Chaque facture porte un QR code. En le scannant, votre banque ou votre fournisseur ouvre une page de vérification qui confirme que la facture est authentique et n'a pas été modifiée." },
  { q: "Mon téléphone est ancien, est-ce que ça va marcher ?", r: "Kazimara est conçu pour les téléphones Android d'entrée de gamme et la 3G : peu de données échangées, des écrans légers." },
  { q: "Combien ça coûte ?", r: "Les tarifs seront annoncés à l'ouverture. Créez votre compte dès maintenant pour découvrir Kazimara et être informé en premier." },
];

export default function Accueil() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-transparent bg-fond/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-texte-2 md:flex">
            <a href="#fonctions" className="hover:text-texte">Fonctions</a>
            <a href="#whatsapp" className="hover:text-texte">WhatsApp</a>
            <a href="#questions" className="hover:text-texte">Questions</a>
          </nav>
          <LienBouton href="/connexion" variante="secondaire">Se connecter</LienBouton>
        </div>
      </header>

      <main className="overflow-x-clip">
        {/* Accroche */}
        <section className="relative">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-or/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 top-60 h-[420px] w-[420px] rounded-full bg-primaire/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:py-24">
            <div>
              <p className="kz-entree text-xs font-bold uppercase tracking-[0.2em] text-accent">Pour les commerçants du Sénégal</p>
              <h1 className="kz-entree mt-4 text-4xl font-extrabold leading-[1.1] md:text-6xl" style={{ animationDelay: ".1s" }}>
                Votre commerce se bâtit <span className="text-primaire">brique par brique</span>.
              </h1>
              <p className="kz-entree mt-6 max-w-xl text-lg text-texte-2 md:text-xl" style={{ animationDelay: ".2s" }}>
                Kazimara tient vos ventes, vos factures, vos encaissements, votre ardoise et votre stock.
                <strong className="text-texte"> Même sans réseau. Même par message vocal.</strong>
              </p>
              <div className="kz-entree mt-8 flex flex-wrap gap-3" style={{ animationDelay: ".3s" }}>
                <LienBouton href="/connexion" className="px-6 py-3 text-base">Commencer avec mon numéro</LienBouton>
                <LienBouton href="#comment" variante="secondaire" className="px-6 py-3 text-base">Comment ça marche</LienBouton>
              </div>
              <ul className="kz-entree mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-texte-2" style={{ animationDelay: ".4s" }}>
                <li>✓ Connexion par numéro de téléphone</li>
                <li>✓ Français et wolof</li>
                <li>✓ Factures conformes</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="rounded-[3rem] border border-bordure bg-surface p-10 shadow-xl md:p-14">
                  <SymboleAnime className="h-44 w-44 md:h-64 md:w-64" />
                </div>
                <div className="kz-bulle absolute -bottom-5 -left-6 rounded-2xl border border-bordure bg-surface px-4 py-3 shadow-lg" style={{ animationDelay: "1.8s" }}>
                  <p className="text-xs text-texte-2">Ventes du jour</p>
                  <p className="text-lg font-bold tabular-nums text-primaire">124 500 FCFA</p>
                </div>
                <div className="kz-bulle absolute -right-4 -top-4 rounded-2xl border border-bordure bg-surface px-4 py-2 shadow-lg" style={{ animationDelay: "2.2s" }}>
                  <p className="text-sm font-semibold">✓ Payée par Wave</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BandeauDefilant elements={["Wave", "Orange Money", "Free Money", "Espèces", "Factures avec QR code", "Fonctionne hors-ligne", "Français", "Wolof", "TVA 18 % calculée", "Ardoise client", "Alertes de stock"]} />

        {/* Avant / après */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Apparition>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Le quotidien change</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold md:text-4xl">Rangez le cahier. Gardez le contrôle.</h2>
          </Apparition>
          <div className="mt-10 grid gap-3">
            {avantApres.map(([avant, apres], i) => (
              <Apparition key={avant} delai={i * 80}>
                <div className="grid items-center gap-2 rounded-2xl border border-bordure bg-surface p-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6 sm:p-5">
                  <p className="text-texte-2 line-through decoration-accent/60">{avant}</p>
                  <span className="hidden text-xl text-or sm:block" aria-hidden="true">→</span>
                  <p className="font-semibold">{apres}</p>
                </div>
              </Apparition>
            ))}
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="comment" className="scroll-mt-20 bg-baobab text-creme">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <Apparition>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-or">Simple comme bonjour</p>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Trois gestes, chaque jour</h2>
            </Apparition>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {etapes.map((e, i) => (
                <Apparition key={e.n} delai={i * 120}>
                  <div className="h-full rounded-3xl bg-creme/5 p-6 ring-1 ring-creme/10 transition hover:bg-creme/10">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-or text-xl font-extrabold text-encre">{e.n}</span>
                    <h3 className="mt-5 text-xl font-bold">{e.titre}</h3>
                    <p className="mt-2 text-creme/75">{e.texte}</p>
                  </div>
                </Apparition>
              ))}
            </div>
          </div>
        </section>

        {/* Fonctions */}
        <section id="fonctions" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <Apparition>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Tout-en-un</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Tout ce qu'il faut, rien de compliqué</h2>
          </Apparition>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fonctions.map((f, i) => (
              <Apparition key={f.titre} delai={(i % 3) * 100}>
                <div className="group h-full rounded-3xl border border-bordure bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-primaire/40 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fond text-2xl transition group-hover:scale-110" aria-hidden="true">{f.icone}</span>
                  <h3 className="mt-4 text-lg font-bold">{f.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-texte-2">{f.texte}</p>
                </div>
              </Apparition>
            ))}
          </div>
        </section>

        {/* WhatsApp */}
        <section id="whatsapp" className="scroll-mt-20 border-y border-bordure bg-surface">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
            <Apparition>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Nouveau</p>
              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Dites votre vente. Kazimara s'occupe du reste.</h2>
              <p className="mt-5 text-lg text-texte-2">
                Envoyez un message vocal au numéro WhatsApp de Kazimara, en français ou en wolof.
                Il retrouve vos produits, votre client et le mode de paiement, puis vous propose la vente.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Rien n'est enregistré sans votre validation",
                  "En cas de doute, Kazimara pose une seule question",
                  "La facture PDF arrive directement dans la conversation",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primaire text-xs text-creme">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Apparition>
            <Apparition delai={150}>
              <ConversationWhatsApp />
            </Apparition>
          </div>
        </section>

        {/* Le symbole */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Apparition>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Kazi + imara</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold md:text-4xl">Le travail solide : un nom, une promesse</h2>
            <p className="mt-4 max-w-2xl text-lg text-texte-2">
              « Kazi », le travail. « Imara », la solidité. Notre symbole raconte la route de chaque entrepreneur.
            </p>
          </Apparition>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {symbole.map((s, i) => (
              <Apparition key={s.titre} delai={i * 120}>
                <div className="h-full rounded-3xl border border-bordure bg-surface p-6">
                  <span className={`block h-3 w-12 rounded-full ${s.couleur}`} />
                  <h3 className="mt-5 text-lg font-bold">{s.titre}</h3>
                  <p className="text-sm font-medium text-accent">{s.sous}</p>
                  <p className="mt-3 text-sm leading-relaxed text-texte-2">{s.texte}</p>
                </div>
              </Apparition>
            ))}
          </div>
        </section>

        {/* Questions */}
        <section id="questions" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-20">
          <Apparition>
            <h2 className="text-center text-3xl font-extrabold md:text-4xl">Vos questions</h2>
          </Apparition>
          <div className="mt-10 flex flex-col gap-3">
            {questions.map((q, i) => (
              <Apparition key={q.q} delai={i * 60}>
                <details className="group rounded-2xl border border-bordure bg-surface p-5 open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {q.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fond text-primaire transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-texte-2">{q.r}</p>
                </details>
              </Apparition>
            ))}
          </div>
        </section>

        {/* Appel final */}
        <section className="px-4 pb-20">
          <Apparition>
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-encre px-6 py-16 text-center text-creme md:py-20">
              <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-or/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
              <h2 className="relative text-3xl font-extrabold md:text-5xl">Posez la première brique aujourd'hui.</h2>
              <p className="relative mx-auto mt-4 max-w-xl text-lg text-creme/75">Un numéro de téléphone suffit. Pas d'e-mail, pas de mot de passe à retenir.</p>
              <div className="relative mt-8 flex justify-center">
                <LienBouton href="/connexion" variante="accent" className="px-8 py-3.5 text-base">Créer mon compte</LienBouton>
              </div>
            </div>
          </Apparition>
        </section>
      </main>

      <footer className="border-t border-bordure">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
          <Logo slogan />
          <nav className="flex flex-wrap gap-6 text-sm text-texte-2">
            <a href="#fonctions" className="hover:text-texte">Fonctions</a>
            <a href="#whatsapp" className="hover:text-texte">WhatsApp</a>
            <a href="#questions" className="hover:text-texte">Questions</a>
            <a href="/connexion" className="hover:text-texte">Se connecter</a>
          </nav>
          <p className="text-sm text-texte-2">© {new Date().getFullYear()} Kazimara · Dakar, Sénégal</p>
        </div>
      </footer>
    </>
  );
}
