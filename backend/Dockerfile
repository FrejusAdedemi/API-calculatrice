FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src ./src
COPY tests/ ./tests

EXPOSE 3000

CMD [ "node", "src/app.js" ]