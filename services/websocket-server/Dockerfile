FROM node:18-slim

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ws-server.js ./
CMD [ "node", "ws-server.js" ]
