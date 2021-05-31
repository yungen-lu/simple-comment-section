const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { getUserId } = require('./utils');
const { schema } = require('./schema');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('http');
// const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const pubsub = new PubSub();
const app = express();
const prisma = new PrismaClient();
const PORT = 4000;
// app.use(express.json());
const Redis = require('ioredis');
const session = require('express-session');

let RedisStore = require('connect-redis')(session);
const redisClient = new Redis();
app.use(
  session({
    name: 'sid',
    store: new RedisStore({ client: redisClient }),
    secret: 'asd',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);
// app.get('/app', async (req, res) => {
//   req.session.userId = user;
// });
app.use('/signin', express.static('public/signin'));
app.use('/login', express.static('public/login'));
app.use('/app', (req, res) => {
  console.log('connected');
  const cookieString = req.headers.cookie;
  let tmp = null;
  console.log('cookie ', cookieString);
  if (cookieString) {
    const cookieParsed = cookie.parse(cookieString);
    console.log('cookieParsed ', cookieParsed);
    if (cookieParsed.sid) {
      let sidParsed = cookieParser.signedCookie(cookieParsed.sid, 'asd');
      sidParsed = 'sess:' + sidParsed;
      console.log(sidParsed);
      redisClient
        .get(sidParsed)
        .then((e) => {
          console.log(e);
          tmp = JSON.parse(e);
          console.log(tmp);
          res.redirect('/test');
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
});
const apolloServer = new ApolloServer({
  schema: schema,
  context: async ({ req }) => {
    let id;
    if (req && (req.headers.authorization || req.headers.cookie)) {
      let e = await getUserId(req);
      id = JSON.parse(e);
    } else {
      id = null;
    }
    console.log('id is ', id);
    return {
      req,
      prisma,
      pubsub,
      userId: id.userId,

      // req && (req.headers.authorization || req.headers.cookie)
      //   ? getUserId(req).then()
      //   : null,
    };
  },
});

apolloServer.applyMiddleware({ app });
const server = createServer(app);
apolloServer.installSubscriptionHandlers(server);
server.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );
});
