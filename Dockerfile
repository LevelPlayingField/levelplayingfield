ARG ALPINE_VERSION=3.16

FROM node:alpine${ALPINE_VERSION} as builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

CMD ["npm", "start"]
EXPOSE 3000
