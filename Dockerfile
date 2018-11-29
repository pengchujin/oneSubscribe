FROM node:9.6
MAINTAINER PengChujin <pengchujin@hotmail.com>

WORKDIR /code

COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock

RUN yarn install --production

COPY api/api.graphql /code/api/api.graphql
COPY configs/prod/ormconfig.json /code/ormconfig.json
COPY lib/src /code/src
COPY lib/configs/prod/config.js /code/config.js
COPY lib/configs/prod/config.js.map /code/config.js.map

ENV NODE_ENV production
EXPOSE 3001
CMD ["node", "src/app.js"]
