FROM node:16 as webpackbase

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
COPY frontend ./frontend
RUN yarn install --frozen-lockfile
# tmp fix
ENV APP_PORT=4000
ENV APP_DOMAIN=comment.k8s.yungen.studio
RUN yarn workspace frontend run build-prod

FROM node:16 as base

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
COPY backend ./backend
RUN yarn install --production


FROM node:alpine
WORKDIR /usr/src/app
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
COPY --from=webpackbase /usr/src/app/frontend/public ./frontend/public
COPY --from=base /usr/src/app/backend ./backend
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY package.json ./
RUN yarn workspace backend run prisma:gen
CMD ["yarn","workspace","backend","run","server"]
