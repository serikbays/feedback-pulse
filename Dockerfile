FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
COPY --from=frontend-builder /app/dist ./dist

RUN npx prisma generate

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
