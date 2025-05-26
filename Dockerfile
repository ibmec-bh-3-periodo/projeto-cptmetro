FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY src/ ./src/

RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY src ./src
COPY index.html ./
COPY src/login\ e\ registro/login.css ./src/login\ e\ registro/login.css
COPY src/login\ e\ registro/registro.js ./src/login\ e\ registro/registro.js
COPY src/icones ./src/icones
COPY src/homepage/home.html ./src/homepage/home.html
COPY src/qrcode/qrcode.html ./src/qrcode/qrcode.html
COPY src/mapa/mapa.html ./src/mapa/mapa.html
COPY src/configuração/config.html ./src/configuração/config.html
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/server.js"] 