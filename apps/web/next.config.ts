import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // Serveur autonome minimal pour l'image Docker de production.
  output: "standalone",
  outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  // Les paquets partagés sont publiés en TypeScript source dans le monorepo.
  transpilePackages: ["@kazimara/domain", "@kazimara/schemas", "@kazimara/i18n", "@kazimara/ui-tokens"],
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default config;
