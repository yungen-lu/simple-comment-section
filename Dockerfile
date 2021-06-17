FROM node:16 AS base

WORKDIR /app

COPY *.json ./
COPY yarn.lock ./
COPY frontend/*.json ./frontend/
COPY frontend/*.js ./frontend/

COPY backend/*.json ./backend/
RUN yarn install --pure-lockfile --production --ignore-scripts
COPY backend/node_modules /tmp/backend/node_modules
COPY node_modules /tmp/node_modules

RUN yarn install --pure-lockfile

COPY frontend/src ./frontend/src
COPY frontend/public ./frontend/public
COPY backend/prisma ./backend/prisma
RUN yarn workspace frontend run build
RUN yarn workspace backend run prisma:gen


FROM node:16-slim

COPY --from=base /tmp/node_modules ./node_modules
COPY --from=base /tmp/backend/node_modules ./backend/node_modules
COPY --from=base /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=base /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=base /app/backend/node_modules/.prisma/client ./backend/node_modules/.prisma/client
COPY --from=base /app/frontend/public ./frontend/public

COPY backend/resolvers ./backend/resolvers
COPY backend/schema.graphql ./backend/
COPY backend/*.js ./backend/
COPY backend/package.json ./backend/
COPY package.json ./

CMD ["yarn","workspace","backend","run","server"]
