# Ground/self-host build for a Manus WebDev full-stack app (Vite/React + Express/tRPC + Drizzle).
# Builds the client (dist/public) and bundles the server (dist/index.js), then serves on $PORT.
FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable
# deps first for layer caching
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN corepack prepare pnpm@10.4.1 --activate && pnpm install --frozen-lockfile
# source + build
COPY . .
RUN pnpm build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# runtime needs node_modules because the server bundle uses --packages=external
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/index.js"]
