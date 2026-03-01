# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable

COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/frontend/package.json ./packages/frontend/package.json
COPY packages/cms/package.json ./packages/cms/package.json

RUN yarn install --immutable

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN yarn workspace frontend build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=build --chown=node:node /app/packages/frontend/public ./public
COPY --from=build --chown=node:node /app/packages/frontend/.next/standalone ./
COPY --from=build --chown=node:node /app/packages/frontend/.next/static ./.next/static

USER node

EXPOSE 3000
CMD ["node", "server.js"]