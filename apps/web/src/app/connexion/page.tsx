"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Bouton, Carte, Champ, Erreur } from "@/components/ui";
import { api } from "@/lib/api";
import { messageErreur } from "@/lib/erreurs";

export default function Connexion() {
  const router = useRouter();
  const [etape, setEtape] = useState<"numero" | "code">("numero");
  const [saisie, setSaisie] = useState("");
  const [telephone, setTelephone] = useState("");
  const [code, setCode] = useState("");
  const [codeDev, setCodeDev] = useState<string>();
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  async function demander(e: React.FormEvent) {
    e.preventDefault();
    setErreur(""); setEnCours(true);
    try {
      const r = await api.demanderOtp(saisie);
      setTelephone(r.telephone); setCodeDev(r.codeDev); setEtape("code");
    } catch (err) { setErreur(messageErreur(err)); }
    finally { setEnCours(false); }
  }

  async function verifier(e: React.FormEvent) {
    e.preventDefault();
    setErreur(""); setEnCours(true);
    try {
      const s = await api.verifierOtp(telephone, code);
      router.replace(s.commerce ? "/tableau-de-bord" : "/commerce");
    } catch (err) { setErreur(messageErreur(err)); setEnCours(false); }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-8 px-4 py-10">
      <div className="flex justify-center"><Logo slogan /></div>
      <Carte>
        {etape === "numero" ? (
          <form onSubmit={demander} className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-bold">Connexion</h1>
              <p className="mt-1 text-sm text-texte-2">Entrez votre numéro : vous recevrez un code par SMS.</p>
            </div>
            <Champ label="Numéro de téléphone" type="tel" inputMode="tel" autoComplete="tel" placeholder="77 123 45 67"
              value={saisie} onChange={(e) => setSaisie(e.target.value)} required aide="Numéros sénégalais (+221) uniquement" />
            <Erreur>{erreur}</Erreur>
            <Bouton type="submit" disabled={enCours}>{enCours ? "Envoi…" : "Recevoir le code"}</Bouton>
          </form>
        ) : (
          <form onSubmit={verifier} className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl font-bold">Code reçu par SMS</h1>
              <p className="mt-1 text-sm text-texte-2">Envoyé au {telephone}. Il est valable 5 minutes.</p>
            </div>
            {codeDev && (
              <p className="rounded-xl bg-or/20 px-3 py-2 text-sm">
                Mode développement : aucun SMS n'est envoyé. Code : <strong className="font-mono">{codeDev}</strong>
              </p>
            )}
            <Champ label="Code à 6 chiffres" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="\d{6}"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} required className="[&_input]:tracking-[0.4em] [&_input]:font-mono" />
            <Erreur>{erreur}</Erreur>
            <Bouton type="submit" disabled={enCours || code.length !== 6}>{enCours ? "Vérification…" : "Valider"}</Bouton>
            <button type="button" className="text-sm text-texte-2 underline" onClick={() => { setEtape("numero"); setCode(""); setErreur(""); }}>
              Changer de numéro
            </button>
          </form>
        )}
      </Carte>
    </main>
  );
}
