FROM node:22-alpine

WORKDIR /app

# dependências primeiro (melhor cache)
COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

