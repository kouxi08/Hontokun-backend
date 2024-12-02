FROM node:20-alpine AS base

FROM base AS builder

ARG cms_domain
ARG cms_api_key
ARG database_url
ARG app_credentials


ENV CMS_SERVICE_DOMAIN=${domain}
ENV CMS_API_KEY=${api_key}
ENV DATABASE_URL=${database_url}
ENV GOOGLE_APPLICATION_CREDENTIALS=${app_credentials}
ENV NODE_ENV=production


WORKDIR /app

COPY package*json tsconfig.json src drizzle service-account-file.json ./

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]