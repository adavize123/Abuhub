# Frontend Dockerfile for Next.js production

FROM node:20-alpine AS builder
WORKDIR /app

# Install build deps
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy app files and node modules from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Install only production deps
RUN npm ci --production --silent

EXPOSE 3000
CMD ["npm", "start"]
