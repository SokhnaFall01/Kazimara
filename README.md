<p align="center"><img src="brand/kazimara-logo.svg" alt="Kazimara — Le travail solide" width="420"></p>

# Kazimara

Gestion simplifiée pour les commerçants sénégalais : ventes et factures conformes, encaissements
(espèces, Wave, Orange Money, Free Money via PayDunya), ardoise client, stock, livre de caisse automatique,
et saisie des ventes par WhatsApp, en texte ou en vocal (français et wolof).

Architecture de référence : [`docs/Kazimara_Architecture_technique_V1.pdf`](docs/Kazimara_Architecture_technique_V1.pdf) ·
Décisions ouvertes : [`docs/decisions.md`](docs/decisions.md) · Charte : [`brand/`](brand/README.md)

## Organisation du dépôt

Monorepo TypeScript (pnpm + Turborepo). Une règle de calcul est écrite une fois et utilisée partout.

```
apps/
  mobile/       React Native + Expo (iOS, Android)        — à générer (sprint 1)
  web/          Next.js : page d'accueil + app web        — en cours (API simulée)
  api/          NestJS : API, webhooks, workers           — à générer (sprint 1)
packages/
  domain/       règles métier pures : TVA, totaux, statuts de paiement, ardoise,
                numérotation FAC-2026-000001, livre de caisse, téléphone +221
  schemas/      schémas Zod partagés (entrées d'API, lots de synchronisation, erreurs)
  i18n/         traductions FR / EN (mêmes clés vérifiées à la compilation et en test)
  ui-tokens/    couleurs, typographie, espacements Kazimara (TS + variables CSS)
infra/
  docker/       docker-compose de dev : PostgreSQL 16, Redis, MinIO (S3)
  deploy/       configuration des environnements
brand/          logo et symbole en SVG
```

Le paquet `api-client` (client typé généré depuis l'OpenAPI de l'API) arrivera avec `apps/api`.

## Démarrer

Prérequis : Node 22, pnpm 10, Docker.

```bash
pnpm install
```

```bash
pnpm typecheck && pnpm test
```

```bash
pnpm --filter @kazimara/web dev
```

L'app web tourne sur http://localhost:3000 avec une **API simulée** dans le navigateur
(aucun serveur nécessaire, aucun SMS envoyé : le code de connexion de développement est `123456`).
Chaque écran passe par l'interface `KazimaraApi` (`apps/web/src/lib/api/client.ts`), qui reprend les routes
de l'architecture §11. Quand un module de l'API NestJS est prêt (SMS, PayDunya, WhatsApp…), on le branche
sans toucher aux écrans.

Pour les services de l'API (à venir) :

```bash
cp .env.example .env && pnpm dev:infra
```

## Principes

1. **Le serveur fait foi** : montants, statuts de facture et de paiement sont recalculés côté serveur.
2. **Hors-ligne d'abord** sur le mobile : vendre, consulter le stock et la compta sans réseau.
3. **Rien d'irréversible sans confirmation** : une vente dictée n'est enregistrée qu'après validation.
4. **Portabilité** : tout en conteneurs Docker, aucun service propriétaire bloquant.
5. **Léger** pour les petits téléphones et la 3G.

Montants toujours en **entiers FCFA**. Aucune suppression physique de vente, facture ou paiement : on annule par un avoir.

---

NumuConnect pour Kazimara — projet porté par M. Thiouna Ndiaye.
