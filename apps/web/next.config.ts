import type { NextConfig } from "next";

const config: NextConfig = {
  // Les paquets partagés sont publiés en TypeScript source dans le monorepo.
  transpilePackages: ["@kazimara/domain", "@kazimara/schemas", "@kazimara/i18n", "@kazimara/ui-tokens"],
};

export default config;
