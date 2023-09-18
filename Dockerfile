FROM node:18-alpine 

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start:dev"]
