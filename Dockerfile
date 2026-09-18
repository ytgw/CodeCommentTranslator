FROM node:alpine

RUN apk update && apk add git
RUN npm install -g npm-check-updates

USER node
WORKDIR /app
