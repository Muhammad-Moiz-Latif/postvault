# ---------- STAGE 1: build the app ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (copy package files first so layer caches)
COPY package*.json ./
# If you use pnpm or yarn, adjust these commands
RUN npm ci

# Copy source & build
# Copy TypeScript and config files
COPY next.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./

# Copy all folders that contain source code and public assets
COPY app ./app
COPY assets ./assets
COPY components ./components
COPY features ./features
COPY hooks ./hooks
COPY lib ./lib
COPY public ./public
COPY state ./state

# Copy any other needed root-level TS files
COPY auth.ts ./
COPY middleware.ts ./
COPY next-env.d.ts ./
# If you use next.config.js or env vars at build time, ensure they are set
RUN npm run build

# ---------- STAGE 2: run the app ----------
FROM node:18-alpine AS runner
WORKDIR /app

# Only copy the necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# Set NODE_ENV
ENV NODE_ENV=production
# port Next will listen on inside container
ENV PORT=3000

EXPOSE 3000

# Run Next in production (uses next start)
CMD ["npm", "run", "start"]
