import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Kazimara — Le travail solide", template: "%s · Kazimara" },
  description: "Ventes, factures conformes, encaissements Wave et Orange Money, ardoise et stock pour les commerçants du Sénégal.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F2EA" },
    { media: "(prefers-color-scheme: dark)", color: "#10201A" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh antialiased">
        {process.env.NEXT_PUBLIC_API_MODE !== "http" && (
          <div className="bg-or px-4 py-1.5 text-center text-xs font-medium text-encre">
            Version de démonstration : les données restent sur cet appareil et aucun SMS n'est envoyé.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
