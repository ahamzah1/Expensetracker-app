FROM node:14-alpine

EXPOSE 5000

WORKDIR /usr/src/app

ENV REACT_APP_BACKEND=http://localhost/api

COPY package* ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5000

CMD ["serve", "-s", "-l", "5000", "build"]
