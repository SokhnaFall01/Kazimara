# Image de production de l'app web. Construite depuis la racine du dépôt :
#   docker build -f apps/web/Dockerfile .
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
ARG NEXT_PUBLIC_API_MODE=mock
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_API_MODE=$NEXT_PUBLIC_API_MODE \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN pnpm install --frozen-lockfile --filter "@kazimara/web..." \
 && pnpm --filter @kazimara/web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S kazimara && adduser -S kazimara -G kazimara
COPY --from=build --chown=kazimara:kazimara /repo/apps/web/.next/standalone ./
COPY --from=build --chown=kazimara:kazimara /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=kazimara:kazimara /repo/apps/web/public ./apps/web/public
USER kazimara
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "apps/web/server.js"]
