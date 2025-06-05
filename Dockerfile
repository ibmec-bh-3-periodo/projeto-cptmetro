# Etapa 1: build com dependências completas
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: imagem final mais leve (produção)
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/usuarios.json ./src/usuarios.json
COPY --from=builder /app/src/database.json ./src/database.json
COPY --from=builder /app/index.html ./index.html

EXPOSE 3000

CMD ["node", "dist/server.js"]
