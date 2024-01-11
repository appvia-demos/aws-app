FROM node:16.15.0-alpine3.15

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY pages ./pages
COPY public ./public
RUN echo ${version} > ./VERSION
RUN npm run build

CMD [ "npm", "start" ]
