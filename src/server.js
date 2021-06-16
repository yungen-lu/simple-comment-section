const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { typeDefs, resolvers } = require('./schema');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('http');
const { parseCookie } = require('./utils');
const { APP_PORT, SESSION_SECRET, REDIS_HOST } = require('./constants');
const Redis = require('ioredis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
let redisClient;
if (process.env.NODE_ENV == 'production') {
  redisClient = new Redis(6379, REDIS_HOST);
} else {
  redisClient = new Redis();
}
const pubsub = new PubSub();
const prisma = new PrismaClient();
const app = express();

app.use(
  session({
    name: 'sid',
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(
  '/app',
  (req, res, next) => {
    console.log('connected to app');
    if (!req.session || !req.session.userId) {
      console.log('no cookie');
      res.redirect('/loginsignup');
    } else {
      console.log('OK');
      next();
    }
  },
  express.static('public/app')
);

app.use('/loginsignup', express.static('public/loginsignup'));
app.post('/login', express.json(), async (req, res) => {
  console.log(req.body);
  const bcrypt = require('bcryptjs');
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new Error('No such user found');
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    req.session.userId = user.id;
    // res.redirect(301, '/app');
    res.status(200).send({ id: user.id, url: '/app' });
  } catch (err) {
    console.log(err);
    throw new Error('server error');
  }
});

app.post('/signup', express.json(), async (req, res) => {
  console.log(req.body);
  const bcrypt = require('bcryptjs');

  try {
    const password = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: { email: req.body.email, name: req.body.user, password },
    });
    console.log(user);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    // throw new Error('server error');
  }
});

app.get('*', (req, res) => {
  if (req.session.userId) {
    console.log('logged in');
    res.redirect('/app');
  } else {
    console.log('not logged in');
    res.redirect('/loginsignup');
  }
});

const apolloServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log(webSocket.upgradeReq.headers.cookie);
      return {
        userId: parseCookie(webSocket.upgradeReq.headers.cookie),
      };
    },
  },
  context: ({ req, res, connection }) => {
    // console.log(req.session);
    if (connection) {
      if (!connection.context.userId) {
        res.status(500).send('not authenticated');
      }
      return {
        prisma,
        pubsub,
        userId: connection.context.userId,
      };
    }
    return {
      // req,
      prisma,
      pubsub,
      userId: req.session && req.session.userId ? req.session.userId : null,
    };
  },
});

apolloServer.applyMiddleware({ app });
const server = createServer(app);
apolloServer.installSubscriptionHandlers(server);

server.listen(APP_PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${APP_PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${APP_PORT}${apolloServer.subscriptionsPath}`
  );
  console.log(redisClient.status);
});
