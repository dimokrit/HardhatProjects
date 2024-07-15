# Dockerfile

# base image
FROM node:18-alpine

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY package.json yarn.lock  ./

# install dependencies
RUN yarn install

# copy source files
COPY . /usr/src
COPY ./.env /usr/src/.env

WORKDIR /usr/src/game
RUN yarn install
RUN yarn build

WORKDIR /usr/src

RUN npx prisma generate

# start app
RUN yarn build
EXPOSE 3000
CMD yarn start:migrate & yarn start