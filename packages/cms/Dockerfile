# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable

COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/cms/package.json ./packages/cms/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json

RUN yarn install --immutable

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/ ./
COPY packages/cms ./packages/cms
COPY packages/frontend ./packages/frontend

ENV NODE_ENV=production

RUN yarn workspace cms build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable

ENV NODE_ENV=production

# Copy the built Strapi app
COPY --from=build /app/packages/cms ./packages/cms

WORKDIR /app/packages/cms
EXPOSE 1337

CMD ["yarn", "start"]