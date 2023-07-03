FROM node:19-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn add rimraf
RUN yarn install

COPY . .

RUN yarn build
CMD ["yarn", "start:dev"]
