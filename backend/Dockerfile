# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production --silent

# Copy source
COPY . .

EXPOSE 5000
CMD ["node", "src/server.js"]
