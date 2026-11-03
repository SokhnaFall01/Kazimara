#!/usr/bin/env sh
# Met en ligne (ou met à jour) Kazimara sur le serveur. À lancer depuis la racine du dépôt :
#   sh infra/deploy/deployer.sh
set -eu
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "Il manque infra/deploy/.env : copiez .env.example et indiquez votre domaine." >&2
  exit 1
fi
. ./.env
echo "Déploiement de Kazimara sur https://$DOMAIN …"

git -C ../.. pull --ff-only || echo "(pas de mise à jour git, on continue avec le code présent)"
docker compose up -d --build
docker image prune -f >/dev/null

echo "Terminé. Vérifiez https://$DOMAIN (le premier certificat HTTPS peut prendre une minute)."
