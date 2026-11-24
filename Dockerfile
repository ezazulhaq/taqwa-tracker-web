# ==========================================
# Stage 1: Build & Dependency Resolution
# ==========================================
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for optimal layer caching
COPY package.json package-lock.json ./

# Install clean dependencies
RUN npm ci --prefer-offline --no-audit

# Copy application source code
COPY . .

# Build the Angular application for production
RUN npm run build -- --configuration production

# ==========================================
# Stage 2: Production Nginx Runtime
# ==========================================
FROM nginx:alpine AS runner

LABEL maintainer="Taqwa Tracker Team" \
      description="Production image for Taqwa Tracker Web"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled application from builder stage
COPY --from=builder /app/dist/taqwa-tracker/browser /usr/share/nginx/html

# Expose default HTTP port
EXPOSE 80

# Healthcheck checking the /healthz endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/healthz || exit 1

# Start Nginx server in foreground
CMD ["nginx", "-g", "daemon off;"]
