FROM node:12.22.1-alpine3.12

WORKDIR /build
COPY ["package.json", "package-lock.json*", "./"]
COPY . .
RUN npm install --production

CMD ["node", "build/app.js"]