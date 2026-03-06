# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable

RUN echo "Listing files:" && ls -la

COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn ./.yarn
COPY packages/cms/package.json ./packages/cms/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json

RUN yarn install --immutable

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY --from=deps /app ./
COPY packages/cms ./packages/cms
COPY packages/frontend ./packages/frontend

ENV NODE_ENV=production

RUN yarn workspace frontend build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=build --chown=node:node /app/packages/frontend/public ./packages/frontend/public

RUN mkdir ./packages/frontend/.next
RUN chown node:node ./packages/frontend/.next

COPY --from=build --chown=node:node /app/packages/frontend/.next/standalone ./
COPY --from=build --chown=node:node /app/packages/frontend/.next/static ./packages/frontend/.next/static

USER node

EXPOSE 3000

CMD ["node", "packages/frontend/server.js"]
