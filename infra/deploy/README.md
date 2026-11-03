# Déploiement

| Environnement | Usage | Déploiement |
|---|---|---|
| Développement | `pnpm dev:infra` (PostgreSQL, Redis, MinIO) | Local |
| Recette (staging) | PayDunya en mode test, numéro WhatsApp de test, commerçants pilotes | Automatique à chaque fusion sur `main` |
| Production | Commerçants réels | Manuel, après validation de la recette |

Production pilote : un serveur applicatif (API NestJS, workers BullMQ, Redis, derrière Caddy ou Traefik),
un serveur PostgreSQL dédié avec sauvegardes continues, un stockage objet S3-compatible.
Tout tourne en conteneurs Docker pour pouvoir migrer d'Allemagne vers un datacenter sénégalais.

Les fichiers de configuration arrivent avec l'application `apps/api` (sprint 0 → 1).
