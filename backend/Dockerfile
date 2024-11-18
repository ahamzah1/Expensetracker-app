FROM node:16

WORKDIR /usr/src/app

ENV REQUEST_ORIGIN=http://localhost/

COPY package* ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node","index.js"]