# Etapa 1: Construção
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
RUN npm install

COPY . .

# Compila o código TypeScript
RUN npx tsc

# Etapa 2: Execução
FROM node:18

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
