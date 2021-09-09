FROM node:12.22.1-alpine3.12

WORKDIR /build
COPY . .
RUN npm install --production

CMD ["node", "server.js"]