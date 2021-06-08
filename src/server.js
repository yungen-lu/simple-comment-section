const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const { typeDefs, resolvers } = require('./schema');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('http');
const pubsub = new PubSub();
const app = express();
const prisma = new PrismaClient();
const PORT = 4000;
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
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(
  '/root',
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
  express.static('public/root')
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
    // res.redirect(301, '/root');
    res.status(200).send({ id: user.id, url: '/root' });
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
    throw new Error('server error');
  }
});

app.get('*', (req, res) => {
  if (req.session.userId) {
    console.log('logged in');
    res.redirect('/root');
  } else {
    console.log('not logged in');
    res.redirect('/loginsignup');
  }
});

const apolloServer = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: ({ req }) => {
    return {
      req,
      prisma,
      pubsub,
      userId: req.session.userId,
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
