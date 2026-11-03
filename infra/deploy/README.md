# Mise en ligne sur le serveur

Le domaine se règle **une seule fois**, dans `infra/deploy/.env`. Caddy s'occupe tout seul du certificat
HTTPS (Let's Encrypt) et de son renouvellement, redirige `http://` vers `https://` et `www.` vers le domaine principal.

## 1. Le domaine (chez votre registraire)

Créez deux enregistrements DNS qui pointent vers l'adresse IP publique du serveur :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` (le domaine lui-même) | IP du serveur |
| A | `www` | IP du serveur |

Plus tard, pour l'API et la page de vérification des factures : `api` et `verifier`, même IP.
La propagation DNS peut prendre de quelques minutes à quelques heures.

## 2. Le serveur (une seule fois)

Serveur Linux (Ubuntu 22.04+ ou Debian 12), ports **80** et **443** ouverts.

```bash
curl -fsSL https://get.docker.com | sh
```

```bash
git clone https://github.com/SokhnaFall01/Kazimara.git && cd Kazimara
```

```bash
cp infra/deploy/.env.example infra/deploy/.env && nano infra/deploy/.env
```

Dans ce fichier, remplacez `DOMAIN` par votre domaine (sans `https://` ni `www`) et `ACME_EMAIL` par
une adresse e-mail (elle reçoit les avis d'expiration du certificat).

## 3. Lancer et mettre à jour

```bash
sh infra/deploy/deployer.sh
```

La même commande sert pour chaque mise à jour : elle récupère le code, reconstruit et redémarre sans
toucher aux certificats.

## Vérifier

```bash
docker compose -f infra/deploy/docker-compose.yml ps
```

```bash
docker compose -f infra/deploy/docker-compose.yml logs -f caddy
```

Si le certificat ne s'obtient pas : le DNS ne pointe pas encore vers le serveur, ou les ports 80/443 sont fermés
(pare-feu du serveur ou de l'hébergeur).

## Mode démonstration

Tant que l'API NestJS n'est pas déployée (`API_MODE=mock`), le site affiche un bandeau « Version de démonstration » :
les données restent dans le navigateur de chaque visiteur et le code de connexion est `123456`.
Ne pas y saisir de vraies données clients.

## Environnements (architecture §13)

| Environnement | Usage | Déploiement |
|---|---|---|
| Développement | `pnpm dev:infra` (PostgreSQL, Redis, MinIO) | Local |
| Recette (staging) | PayDunya en mode test, numéro WhatsApp de test, commerçants pilotes | Automatique à chaque fusion sur `main` |
| Production | Commerçants réels | Manuel, après validation de la recette |
