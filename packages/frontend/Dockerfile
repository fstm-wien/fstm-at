# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /repo

RUN apk add --no-cache libc6-compat
RUN corepack enable

COPY .yarnrc.yml package.json yarn.lock ./
COPY packages/ packages/

RUN yarn install --immutable

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /repo
RUN apk add --no-cache libc6-compat
RUN corepack enable

COPY --from=deps /repo/ ./
COPY . .

RUN yarn workspace frontend build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat

COPY --from=build /repo/packages/frontend/.next/standalone ./
COPY --from=build /repo/packages/frontend/.next/static ./.next/static
COPY --from=build /repo/packages/frontend/public ./public

EXPOSE 3000
CMD ["node", "server.js"]