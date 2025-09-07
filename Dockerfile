FROM node

RUN npm install -g npm-check-updates

USER node
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
