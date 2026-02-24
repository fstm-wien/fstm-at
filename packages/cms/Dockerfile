# ---- deps ----
FROM node:20-slim AS deps
WORKDIR /repo

RUN corepack enable

COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/ packages/

RUN yarn install --immutable

# ---- build ----
FROM node:20-slim AS build
WORKDIR /repo

RUN corepack enable

COPY --from=deps /repo/ ./
COPY . .

RUN yarn workspace cms build

# ---- runtime ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

# Copy the built Strapi app
COPY --from=build /repo/packages/cms ./packages/cms

WORKDIR /app/packages/cms
EXPOSE 1337

CMD ["yarn", "start"]