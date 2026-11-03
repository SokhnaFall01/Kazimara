# Applications

| Dossier | Technologie | Sprint |
|---|---|---|
| `mobile/` | React Native + Expo (iOS, Android), SQLite hors-ligne (expo-sqlite + Drizzle) | 1 → 3 |
| `web/` | Next.js (App Router) + Tailwind : page d'accueil et app web | 8 |
| `api/` | NestJS : API REST `/api/v1`, webhooks PayDunya et WhatsApp, workers BullMQ | 1 → 7 |

Chaque application sera générée avec son outil officiel (`create-expo-app`, `create-next-app`, `@nestjs/cli`)
et branchée sur les paquets partagés `@kazimara/domain`, `@kazimara/schemas`, `@kazimara/i18n` et `@kazimara/ui-tokens`.
