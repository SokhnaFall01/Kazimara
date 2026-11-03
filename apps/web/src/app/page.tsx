import { Logo, Symbole } from "@/components/Logo";
import { LienBouton } from "@/components/ui";

const fonctions = [
  { titre: "Ventes et factures", texte: "Déclarez une vente en quelques secondes. La facture conforme Sénégal part en PDF, avec un QR code de vérification." },
  { titre: "Wave, Orange Money, Free Money", texte: "Encaissez en espèces ou en mobile money. La facture passe à « Payée » dès que le paiement est confirmé." },
  { titre: "L'ardoise", texte: "Suivez ce que chaque client vous doit et relancez-le par WhatsApp, sans cahier." },
  { titre: "Stock", texte: "Le stock baisse à chaque vente. Kazimara vous prévient avant la rupture." },
  { titre: "Compta simplifiée", texte: "Ventes, encaissements, dépenses : le livre de caisse se remplit tout seul." },
  { titre: "WhatsApp et vocal", texte: "« J'ai vendu trois sacs de riz à Fatou » — en français ou en wolof. Vous validez d'un tap." },
];

export default function Accueil() {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <LienBouton href="/connexion" variante="secondaire">Se connecter</LienBouton>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Pour les commerçants du Sénégal</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Votre commerce se bâtit <span className="text-primaire">brique par brique</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-texte-2">
              Kazimara tient vos ventes, vos factures, vos encaissements, votre ardoise et votre stock.
              Même sans réseau. Même par message vocal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LienBouton href="/connexion">Commencer avec mon numéro</LienBouton>
              <LienBouton href="#fonctions" variante="secondaire">Voir ce que fait Kazimara</LienBouton>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-[2.5rem] border border-bordure bg-surface p-10 shadow-sm">
              <Symbole className="h-40 w-40 md:h-56 md:w-56" />
            </div>
          </div>
        </section>

        <section id="fonctions" className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="text-2xl font-bold">Tout ce qu'il faut, rien de compliqué</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fonctions.map((f) => (
              <div key={f.titre} className="rounded-2xl border border-bordure bg-surface p-5">
                <h3 className="font-semibold">{f.titre}</h3>
                <p className="mt-2 text-sm text-texte-2">{f.texte}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-bordure">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-texte-2">
          <span>© {new Date().getFullYear()} Kazimara · Le travail solide</span>
          <span>Dakar, Sénégal</span>
        </div>
      </footer>
    </>
  );
}
