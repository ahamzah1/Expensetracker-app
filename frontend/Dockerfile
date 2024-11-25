FROM node:14-alpine AS builder

RUN adduser -S appuser

WORKDIR /usr/src/app

ENV REACT_APP_BACKEND=http://localhost/api

RUN chown appuser /usr/src/app

USER appuser

COPY --chown=appuser package* ./

RUN npm install

COPY --chown=appuser . .

RUN npm run build

FROM node:14-alpine

EXPOSE 5000

WORKDIR /usr/src/app

RUN npm install -g serve

RUN adduser -S appuser

USER appuser

COPY --from=builder /usr/src/app/build ./build

CMD ["serve", "-s", "-l", "5000", "build"]
