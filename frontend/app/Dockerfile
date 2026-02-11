FROM node:20-alpine

WORKDIR /app

# Copia manifests primeiro (cache melhor)
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

