# =============================================================
# FRONTEND DOCKERFILE
# React + Vite  →  static build served by Nginx
# Multi-stage keeps the final image tiny (~25 MB vs ~400 MB)
# =============================================================

# ── Stage 1: install dependencies ────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ── Stage 2: build the React app ─────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Fix permissions for the binaries inside node_modules so Vite can execute smoothly
RUN chmod -R +x ./node_modules/.bin

# Vite outputs the production bundle into /app/dist
RUN npm run build

# ── Stage 3: serve with Nginx ─────────────────────────────────
FROM nginx:stable-alpine AS runner

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config: SPA routing + /api proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
