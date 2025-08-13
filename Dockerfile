# Etapa 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Instala solo las dependencias necesarias
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copia archivos necesarios del build
COPY --from=builder /app/.next .next
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/app app

EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]
