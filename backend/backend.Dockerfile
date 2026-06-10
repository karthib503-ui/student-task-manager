# =============================================================
# BACKEND DOCKERFILE
# Node.js / Express / SQLite (uses node:sqlite — requires Node 22+)
# =============================================================

# ── Stage 1: dependency installation ─────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

# Copy manifests first so Docker caches this layer until they change
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# ── Stage 2: production image ─────────────────────────────────
FROM node:22-alpine AS runner

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy installed modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source (no node_modules, no .env)
COPY . .

# SQLite data lives in /app/database — persist it via a named volume
# (Docker creates the directory; we just document the intent here)
RUN mkdir -p /app/database && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

# Use "node server.js" directly — nodemon is a dev-only tool
CMD ["node", "server.js"]
