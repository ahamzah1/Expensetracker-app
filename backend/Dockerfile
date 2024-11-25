FROM node:16-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:16-slim

WORKDIR /usr/src/app

ENV REQUEST_ORIGIN=http://localhost/

COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app ./

EXPOSE 8080

CMD ["node", "index.js"]
