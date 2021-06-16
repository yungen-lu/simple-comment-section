FROM node:16 AS base
ENV NODE_ENV=development
COPY *.json ./
COPY *.js ./
COPY ./src ./src
COPY public ./public
RUN npm install
ENV NODE_ENV=production
RUN npm run build-p


FROM node:alpine AS server
ENV NODE_ENV=production
COPY package*.json ./
COPY src ./src
COPY public ./public
COPY prisma ./prisma
COPY --from=base public/app/app.js public/app
COPY --from=base public/loginsignup/loginsignup.js public/loginsignup
RUN npm install
# RUN npm deploy
CMD ["npm","run","deploy","&&","node","src/server.js"]
