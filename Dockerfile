# --- build frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- runtime: backend + static frontend ---
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY server.js ./
COPY --from=frontend-builder /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push --skip-generate && node server.js"]
