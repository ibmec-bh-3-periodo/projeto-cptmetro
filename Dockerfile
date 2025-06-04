FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

LABEL name="cptmetro"

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/index.html ./src/

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/server.js"]