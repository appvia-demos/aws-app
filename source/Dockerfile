FROM node:21.3-alpine3.18

ENV NODE_ENV production

# Create a group and user
RUN addgroup app --gid 1002 && adduser -S -G app app --uid 1002 

# Tell docker that all future commands should run as the appuser user
USER app

WORKDIR /app

COPY --chown=app:node source/package*.json .

RUN npm install --legacy-peer-deps

COPY source/pages ./pages

COPY source/public ./public

RUN echo ${version} > ./VERSION

RUN npm run build

CMD [ "npm", "start" ]
