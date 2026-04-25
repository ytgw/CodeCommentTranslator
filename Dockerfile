FROM node

RUN npm install -g npm-check-updates

USER node
WORKDIR /app
